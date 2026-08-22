import React, { useState, useEffect } from "react";
import {
  Camera,
  User,
  Phone,
  Mail,
  Lock,
  Save,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

const HostSettingsPage = () => {
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("hostProfileImage") || ""
  );

  const [formData, setFormData] = useState({
    fullName: localStorage.getItem("hostFullName") || "",
    phone: localStorage.getItem("hostPhone") || "",
    email: localStorage.getItem("hostEmail") || "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      formData.password &&
      formData.password !== formData.confirmPassword
    ) {
      setMessage("Passwords do not match.");
      return;
    }

    localStorage.setItem(
      "hostFullName",
      formData.fullName
    );

    localStorage.setItem(
      "hostPhone",
      formData.phone
    );

    localStorage.setItem(
      "hostEmail",
      formData.email
    );

    if (profileImage) {
      localStorage.setItem(
        "hostProfileImage",
        profileImage
      );
    }

    setFormData((prev) => ({
      ...prev,
      password: "",
      confirmPassword: "",
    }));

    setMessage("Profile settings saved successfully!");
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">

      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">
          Account Settings
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage your host profile, contact information and password.
        </p>
      </div>

      {message && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 px-5 py-4 font-medium">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* PROFILE PHOTO */}
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-sm">

          <h2 className="text-xl font-bold">
            Profile Photo
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Upload or change your profile picture.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">

            <div className="relative">

              <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-background bg-muted shadow-md">

                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}

              </div>

              <label
                htmlFor="profile-image"
                className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
              >
                <Camera className="h-5 w-5" />
              </label>

              <input
                id="profile-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

            </div>

            <div>
              <h3 className="font-semibold">
                Change Profile Picture
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Upload a clear profile photo for your host account.
              </p>
            </div>

          </div>

        </div>

        {/* PERSONAL INFORMATION */}
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-sm">

          <h2 className="text-xl font-bold">
            Personal Information
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="h-12 w-full rounded-xl border border-input bg-background pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Phone Number
              </label>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="h-12 w-full rounded-xl border border-input bg-background pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

          </div>

          <div className="mt-5 space-y-2">

            <label className="text-sm font-medium">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="h-12 w-full rounded-xl border border-input bg-background pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

          </div>

        </div>

        {/* PASSWORD */}
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-sm">

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Change Password
              </h2>

              <p className="text-sm text-muted-foreground">
                Leave blank if you do not want to change your password.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">

            <div className="space-y-2">

              <label className="text-sm font-medium">
                New Password
              </label>

              <div className="relative">

                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="h-12 w-full rounded-xl border border-input bg-background pl-12 pr-12 outline-none focus:ring-2 focus:ring-primary"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>

              </div>

            </div>

            <div className="space-y-2">

              <label className="text-sm font-medium">
                Confirm New Password
              </label>

              <div className="relative">

                <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="h-12 w-full rounded-xl border border-input bg-background pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary"
                />

              </div>

            </div>

          </div>

        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end">

          <button
            type="submit"
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            <Save className="h-5 w-5" />
            Save Changes
          </button>

        </div>

      </form>

    </div>
  );
};

export default HostSettingsPage;
