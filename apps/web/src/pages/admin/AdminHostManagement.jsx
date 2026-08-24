import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Helmet } from "react-helmet";
import {
  Search,
  Users,
  UserCheck,
  Home,
  ShieldCheck,
  RefreshCw,
  Mail,
  Phone,
  CalendarDays,
} from "lucide-react";

import api from "@/lib/api.js";


const AdminHostManagement = () => {

  const [users, setUsers] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    hosts: 0,
    guests: 0,
    admins: 0,
    verified: 0,
  });

  const [activeTab, setActiveTab] =
    useState("hosts");

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);


  const loadUsers = useCallback(
    async (manual = false) => {

      try {

        if (manual) {
          setRefreshing(true);
        }

        const response =
          await api.get("/admin/users");

        const data =
          response.data || {};

        setUsers(
          Array.isArray(data.users)
            ? data.users
            : []
        );

        setStats({
          total:
            data.stats?.total || 0,

          hosts:
            data.stats?.hosts || 0,

          guests:
            data.stats?.guests || 0,

          admins:
            data.stats?.admins || 0,

          verified:
            data.stats?.verified || 0,
        });

      } catch (error) {

        console.error(
          "[Admin Users]",
          error?.response?.data ||
          error.message
        );

      } finally {

        setLoading(false);
        setRefreshing(false);

      }

    },
    []
  );


  useEffect(() => {

    loadUsers();

    const interval =
      setInterval(() => {
        loadUsers();
      }, 10000);

    return () => {
      clearInterval(interval);
    };

  }, [loadUsers]);


  const filteredUsers = useMemo(() => {

    const role =
      activeTab === "hosts"
        ? "host"
        : activeTab === "guests"
          ? "guest"
          : "all";

    const query =
      search.trim().toLowerCase();

    return users.filter((user) => {

      const roleMatch =
        role === "all" ||
        user.role === role;

      if (!roleMatch) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [
        user.name,
        user.email,
        user.phone,
        user.role,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(query)
        );

    });

  }, [
    users,
    activeTab,
    search,
  ]);


  const cards = [
    {
      title: "Total Users",
      value: stats.total,
      icon: Users,
    },
    {
      title: "Total Hosts",
      value: stats.hosts,
      icon: Home,
    },
    {
      title: "Total Guests",
      value: stats.guests,
      icon: UserCheck,
    },
    {
      title: "Verified Users",
      value: stats.verified,
      icon: ShieldCheck,
    },
  ];


  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return "-";
    }

    return parsed.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  return (
    <div className="max-w-[1600px] mx-auto space-y-8 animate-fade-in-up">

      <Helmet>
        <title>
          Users / Hosts | Take On BnB Admin
        </title>
      </Helmet>


      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Users / Hosts
          </h1>

          <p className="text-muted-foreground mt-2">
            Manage hosts, guests and platform users.
          </p>

        </div>


        <button
          type="button"
          onClick={() => loadUsers(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-muted transition disabled:opacity-60"
        >

          <RefreshCw
            className={
              `w-4 h-4 ${
                refreshing
                  ? "animate-spin"
                  : ""
              }`
            }
          />

          Refresh

        </button>

      </div>


      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {cards.map((card) => {

          const Icon =
            card.icon;

          return (
            <div
              key={card.title}
              className="bg-card border border-border rounded-2xl p-5 shadow-sm"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-muted-foreground">
                    {card.title}
                  </p>

                  <p className="text-3xl font-bold mt-2">
                    {card.value}
                  </p>

                </div>

                <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">

                  <Icon className="w-5 h-5" />

                </div>

              </div>

            </div>
          );

        })}

      </div>


      {/* FILTER AREA */}

      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">

        <div className="flex flex-col lg:flex-row gap-4">

          <div className="relative flex-1">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search name, email, phone..."
              className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
            />

          </div>


          <div className="flex gap-2">

            <button
              type="button"
              onClick={() =>
                setActiveTab("hosts")
              }
              className={`px-5 py-3 rounded-xl font-semibold transition ${
                activeTab === "hosts"
                  ? "bg-orange-500 text-white"
                  : "bg-muted text-foreground"
              }`}
            >
              Hosts ({stats.hosts})
            </button>


            <button
              type="button"
              onClick={() =>
                setActiveTab("guests")
              }
              className={`px-5 py-3 rounded-xl font-semibold transition ${
                activeTab === "guests"
                  ? "bg-orange-500 text-white"
                  : "bg-muted text-foreground"
              }`}
            >
              Guests ({stats.guests})
            </button>


            <button
              type="button"
              onClick={() =>
                setActiveTab("all")
              }
              className={`px-5 py-3 rounded-xl font-semibold transition ${
                activeTab === "all"
                  ? "bg-orange-500 text-white"
                  : "bg-muted text-foreground"
              }`}
            >
              All ({stats.total})
            </button>

          </div>

        </div>

      </div>


      {/* TABLE */}

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">

        <div className="px-6 py-5 border-b border-border flex items-center justify-between">

          <div>

            <h2 className="text-xl font-bold">
              {activeTab === "hosts"
                ? "Host Management"
                : activeTab === "guests"
                  ? "Guest Management"
                  : "All Users"}
            </h2>

            <p className="text-sm text-muted-foreground mt-1">
              {filteredUsers.length} records found
            </p>

          </div>

          <div className="text-xs text-muted-foreground">
            Auto refresh: 10 sec
          </div>

        </div>


        {loading ? (

          <div className="p-12 text-center text-muted-foreground">
            Loading users...
          </div>

        ) : filteredUsers.length === 0 ? (

          <div className="p-12 text-center">

            <Users className="w-10 h-10 mx-auto text-muted-foreground mb-3" />

            <p className="font-semibold">
              No users found
            </p>

            <p className="text-sm text-muted-foreground mt-1">
              No matching records are available.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-muted/50">

                <tr>

                  <th className="text-left px-6 py-4 text-sm font-semibold">
                    User
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold">
                    Role
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold">
                    Contact
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold">
                    Joined
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredUsers.map((user) => (

                  <tr
                    key={
                      user._id ||
                      user.id ||
                      user.email
                    }
                    className="border-t border-border hover:bg-muted/30 transition"
                  >

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">

                          {String(
                            user.name ||
                            "U"
                          )
                            .charAt(0)
                            .toUpperCase()}

                        </div>

                        <div>

                          <p className="font-semibold">
                            {user.name || "Unnamed User"}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {user.email || "-"}
                          </p>

                        </div>

                      </div>

                    </td>


                    <td className="px-6 py-4">

                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold capitalize bg-orange-100 text-orange-700">
                        {user.role}
                      </span>

                    </td>


                    <td className="px-6 py-4">

                      <div className="space-y-1 text-sm">

                        <div className="flex items-center gap-2">

                          <Mail className="w-4 h-4 text-muted-foreground" />

                          <span>
                            {user.email || "-"}
                          </span>

                        </div>

                        <div className="flex items-center gap-2">

                          <Phone className="w-4 h-4 text-muted-foreground" />

                          <span>
                            {user.phone || "-"}
                          </span>

                        </div>

                      </div>

                    </td>


                    <td className="px-6 py-4">

                      {user.isVerified ? (

                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verified
                        </span>

                      ) : (

                        <span className="inline-flex px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                          Not Verified
                        </span>

                      )}

                    </td>


                    <td className="px-6 py-4">

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">

                        <CalendarDays className="w-4 h-4" />

                        {formatDate(
                          user.createdAt
                        )}

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};

export default AdminHostManagement;
