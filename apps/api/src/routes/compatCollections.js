import express from "express";
import bcrypt from "bcryptjs";
import ActivityLog from "../models/ActivityLog.js";
import Favorite from "../models/Favorite.js";
import Notification from "../models/Notification.js";
import Property from "../models/Property.js";
import PropertyRate from "../models/PropertyRate.js";
import Review from "../models/Review.js";
import UnavailableDate from "../models/UnavailableDate.js";
import User from "../models/User.js";

const router = express.Router();

const DEFAULT_AMENITIES = [
  "WiFi",
  "Kitchen",
  "Free parking",
  "Pool",
  "Air conditioning",
  "TV",
  "Heating",
  "Garden",
  "Hot tub",
  "Gym",
];

const toPlainRecord = (record) => (record?.toJSON ? record.toJSON() : { ...record });

const scrubUser = (user) => {
  if (!user) {
    return user;
  }

  const payload = user.toJSON ? user.toJSON() : { ...user };
  delete payload.password;
  return payload;
};

const asyncHandler = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const parsePagination = (req) => {
  const page = Math.max(1, Number(req.query.page || req.query.currentPage || 1));
  const perPage = Math.max(1, Number(req.query.perPage || req.query.limit || 100));
  return { page, perPage };
};

const paginate = (records, req) => {
  const { page, perPage } = parsePagination(req);
  const totalItems = records.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const startIndex = (page - 1) * perPage;

  return {
    page,
    perPage,
    totalItems,
    totalPages,
    items: records.slice(startIndex, startIndex + perPage),
  };
};

const applySort = (records, req, fallback = "createdAt") => {
  const sortBy = req.query.sortBy || req.query.sort || fallback;
  const sortField = String(sortBy).startsWith("-") ? String(sortBy).slice(1) : String(sortBy);
  const direction =
    req.query.sortOrder || (String(sortBy).startsWith("-") ? "desc" : "asc");

  return [...records].sort((left, right) => {
    const leftValue = left?.[sortField];
    const rightValue = right?.[sortField];

    if (leftValue == null && rightValue == null) {
      return 0;
    }

    if (leftValue == null) {
      return direction === "desc" ? 1 : -1;
    }

    if (rightValue == null) {
      return direction === "desc" ? -1 : 1;
    }

    const leftNumber = Number(leftValue);
    const rightNumber = Number(rightValue);

    if (!Number.isNaN(leftNumber) && !Number.isNaN(rightNumber)) {
      return direction === "desc" ? rightNumber - leftNumber : leftNumber - rightNumber;
    }

    return direction === "desc"
      ? String(rightValue).localeCompare(String(leftValue))
      : String(leftValue).localeCompare(String(rightValue));
  });
};

const createTextSearchFilter = (fields = []) => (records, req) => {
  const query = String(req.query.q || req.query.search || "").trim().toLowerCase();
  if (!query) {
    return records;
  }

  return records.filter((record) =>
    fields.some((field) => String(record?.[field] || "").toLowerCase().includes(query))
  );
};

const createExactFilter = (fieldMap = {}) => (records, req) =>
  records.filter((record) =>
    Object.entries(fieldMap).every(([queryKey, recordKey]) => {
      const queryValue = req.query[queryKey];
      if (queryValue == null || queryValue === "") {
        return true;
      }

      return String(record?.[recordKey] || "") === String(queryValue);
    })
  );

const createCrudRoutes = (path, Model, options = {}) => {
  const {
    createSanitizer = (payload) => payload,
    updateSanitizer = (payload) => payload,
    transform = (payload) => payload,
    defaultSort = { createdAt: -1 },
    filterRecords = (records) => records,
    listAsPageObject = false,
  } = options;

  router.get(
    `/${path}`,
    asyncHandler(async (req, res) => {
      const records = await Model.find().sort(defaultSort);
      const transformed = filterRecords(records.map((record) => transform(record)), req);

      if (listAsPageObject) {
        return res.json(paginate(applySort(transformed, req), req));
      }

      res.json(applySort(transformed, req));
    })
  );

  router.get(
    `/${path}/:id`,
    asyncHandler(async (req, res) => {
      const record = await Model.findById(req.params.id);

      if (!record) {
        return res.status(404).json({
          message: "Record not found",
        });
      }

      res.json(transform(record));
    })
  );

  router.post(
    `/${path}`,
    asyncHandler(async (req, res) => {
      const record = await Model.create(await createSanitizer(req.body));
      res.status(201).json(transform(record));
    })
  );

  router.put(
    `/${path}/:id`,
    asyncHandler(async (req, res) => {
      const record = await Model.findByIdAndUpdate(
        req.params.id,
        await updateSanitizer(req.body),
        {
          new: true,
          runValidators: true,
        }
      );

      if (!record) {
        return res.status(404).json({
          message: "Record not found",
        });
      }

      res.json(transform(record));
    })
  );

  router.delete(
    `/${path}/:id`,
    asyncHandler(async (req, res) => {
      const record = await Model.findByIdAndDelete(req.params.id);

      if (!record) {
        return res.status(404).json({
          message: "Record not found",
        });
      }

      res.json({
        success: true,
        id: req.params.id,
      });
    })
  );
};

createCrudRoutes("users", User, {
  createSanitizer: async (payload) => {
    const nextPayload = { ...payload };

    if (nextPayload.password) {
      nextPayload.password = await bcrypt.hash(nextPayload.password, 10);
    }

    return nextPayload;
  },
  updateSanitizer: (payload) => {
    const nextPayload = { ...payload };
    delete nextPayload.password;
    return nextPayload;
  },
  transform: scrubUser,
  filterRecords: (records, req) => {
    const filteredByRole = createExactFilter({ role: "role" })(records, req);
    return createTextSearchFilter(["name", "email"])(filteredByRole, req);
  },
});

createCrudRoutes("reviews", Review, {
  filterRecords: (records, req) =>
    createExactFilter({ propertyId: "propertyId", guestId: "guestId" })(
      createTextSearchFilter(["reviewText"])(records, req),
      req
    ),
});
createCrudRoutes("favorites", Favorite, {
  filterRecords: (records, req) =>
    createExactFilter({ guestId: "guestId", propertyId: "propertyId" })(records, req),
});
createCrudRoutes("notifications", Notification, {
  filterRecords: (records, req) =>
    createExactFilter({ userId: "userId", isRead: "isRead", type: "type" })(
      createTextSearchFilter(["title", "message"])(records, req),
      req
    ),
});
createCrudRoutes("property_rates", PropertyRate, {
  filterRecords: (records, req) => createExactFilter({ propertyId: "propertyId" })(records, req),
});
createCrudRoutes("unavailable_dates", UnavailableDate, {
  filterRecords: (records, req) => createExactFilter({ propertyId: "propertyId" })(records, req),
});
createCrudRoutes("activity_logs", ActivityLog, {
  filterRecords: (records, req) =>
    createExactFilter({ targetId: "targetId", targetType: "targetType", actionType: "actionType" })(
      records,
      req
    ),
  listAsPageObject: true,
});

router.get(
  "/amenities",
  asyncHandler(async (req, res) => {
    const dbAmenities = await Property.distinct("amenities");
    const amenityNames = [...new Set([...DEFAULT_AMENITIES, ...dbAmenities.filter(Boolean)])].sort((left, right) =>
      left.localeCompare(right)
    );

    res.json(
      amenityNames.map((name) => ({
        id: name,
        name,
      }))
    );
  })
);

export default router;
