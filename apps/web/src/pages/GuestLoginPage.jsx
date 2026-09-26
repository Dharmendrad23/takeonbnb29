import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext.jsx";
import { toast } from "sonner";

const properties = [
  {
    name: "Luxury Valley Villa",
    location: "Rajpur Road, Dehradun",
    type: "Villa",
    guests: "6 Guests",
    price: "₹4,999/night",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "The Forest Retreat",
    location: "Sahastradhara Road, Dehradun",
    type: "Resort",
    guests: "4 Guests",
    price: "₹3,499/night",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Green View Apartment",
    location: "Canal Road, Dehradun",
    type: "2 BHK",
    guests: "4 Guests",
    price: "₹2,499/night",
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Mountain Mist Villa",
    location: "Jakhan, Dehradun",
    type: "Villa",
    guests: "8 Guests",
    price: "₹5,999/night",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Urban Nest Stay",
    location: "GMS Road, Dehradun",
    type: "1 BHK",
    guests: "2 Guests",
    price: "₹1,899/night",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Hillside Haven",
    location: "Maldevta, Dehradun",
    type: "Villa",
    guests: "6 Guests",
    price: "₹4,499/night",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Royal Garden Stay",
    location: "Rajpur Road, Dehradun",
    type: "3 BHK",
    guests: "6 Guests",
    price: "₹3,999/night",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
  },
];

const Icon = ({ type }) => {
  if (type === "mail") {
    return (
      <svg viewBox="0 0 24 24">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }

  if (type === "lock") {
    return (
      <svg viewBox="0 0 24 24">
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
    );
  }

  if (type === "user") {
    return (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c.7-4 3.2-6 8-6s7.3 2 8 6" />
      </svg>
    );
  }

  if (type === "arrow") {
    return (
      <svg viewBox="0 0 24 24">
        <path d="M5 12h13" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24">
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
};

export default function GuestLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
  login,
  requestPhoneOTP,
  verifyPhoneOTP,
} = useAuth();

  const params = new URLSearchParams(location.search);
  const redirectParam = params.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginMode, setLoginMode] = useState("password");
const [phone, setPhone] = useState("");
const [otp, setOtp] = useState("");
const [otpSent, setOtpSent] = useState(false);
const [otpLoading, setOtpLoading] = useState(false);

  const handleLogin = async (event) => {
  event.preventDefault();

  setError("");

  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    setError("Please enter your email address.");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    setError("Please enter a valid email address.");
    return;
  }

  if (!password) {
    setError("Please enter your password.");
    return;
  }

  setLoading(true);

  try {
    const authData = await login(cleanEmail, password);
    const user = authData?.record;

    if (!user) {
      throw new Error("Guest account could not be verified.");
    }

    if (String(user.role || "").toLowerCase() !== "guest") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");

      throw new Error(
        "This account is not a Guest account. Please use a Guest account to make bookings."
      );
    }

    toast.success("Guest login successful!");

    let destination = "/guest/dashboard";

    if (redirectParam) {
      try {
        const decoded = decodeURIComponent(redirectParam);

        if (decoded.startsWith("/")) {
          destination = decoded;
        }
      } catch {
        destination = "/guest/dashboard";
      }
    }

    navigate(destination, { replace: true });
  } catch (error) {
    console.error("Guest login error:", error);

    setError(
      error?.message ||
        "Invalid email or password."
    );
  } finally {
    setLoading(false);
  }
};


// ===============================
// GUEST PHONE OTP LOGIN
// ===============================

const handleSendOTP = async () => {
  setError("");

  const cleanPhone = phone.trim();

  if (!cleanPhone) {
    setError("Please enter your phone number.");
    return;
  }

  setOtpLoading(true);

  try {
    await requestPhoneOTP(cleanPhone);

    setOtpSent(true);

    toast.success("OTP sent successfully!");
  } catch (error) {
    console.error("Guest OTP error:", error);

    setError(
      error?.message ||
        "Failed to send OTP."
    );
  } finally {
    setOtpLoading(false);
  }
};


const handleVerifyOTP = async () => {
  setError("");

  const cleanPhone = phone.trim();
  const cleanOtp = otp.trim();

  if (!cleanPhone) {
    setError("Please enter your phone number.");
    return;
  }

  if (!cleanOtp) {
    setError("Please enter the OTP.");
    return;
  }

  setOtpLoading(true);

  try {
    const authData = await verifyPhoneOTP(
      cleanPhone,
      cleanOtp
    );

    const user = authData?.user;

    if (!user) {
      throw new Error(
        "Guest account could not be verified."
      );
    }

    if (
      String(user.role || "").toLowerCase() !== "guest"
    ) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");

      throw new Error(
        "This account is not a Guest account."
      );
    }

    toast.success("Guest login successful!");

    let destination = "/guest/dashboard";

    if (redirectParam) {
      try {
        const decoded = decodeURIComponent(
          redirectParam
        );

        if (decoded.startsWith("/")) {
          destination = decoded;
        }
      } catch {
        destination = "/guest/dashboard";
      }
    }

    navigate(destination, {
      replace: true,
    });
  } catch (error) {
    console.error(
      "Guest OTP verification error:",
      error
    );

    setError(
      error?.message ||
        "Invalid OTP."
    );
  } finally {
    setOtpLoading(false);
  }
};

return (
  <>
    <style>{`
        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          margin: 0;
          min-height: 100%;
        }

        body {
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          color: #1f1f1f;
          background: #eee9e3;
        }

        button,
        input {
          font-family: inherit;
        }

        button {
          cursor: pointer;
        }

        .guestLoginPage {
          min-height: 100vh;
          width: 100%;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #eee9e3;
        }

        .propertyBackground {
          position: absolute;
          inset: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 18px;
          padding: 20px 0;
          z-index: 1;
        }

        .propertyRow {
          display: flex;
          width: max-content;
          gap: 16px;
          animation: propertyMove 42s linear infinite;
        }

        .propertyRow:nth-child(2) {
          animation-duration: 48s;
          animation-direction: reverse;
        }

        .propertyRow:nth-child(3) {
          animation-duration: 44s;
        }

        @keyframes propertyMove {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        .propertyCard {
          width: 245px;
          min-width: 245px;
          height: 155px;
          position: relative;
          overflow: hidden;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 8px 25px rgba(0,0,0,.12);
          border: 1px solid rgba(255,255,255,.8);
        }

        .propertyCard img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .propertyCard::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              to top,
              rgba(0,0,0,.78),
              rgba(0,0,0,.04) 70%
            );
        }

        .propertyDetails {
          position: absolute;
          left: 13px;
          right: 13px;
          bottom: 11px;
          z-index: 2;
          color: #fff;
        }

        .propertyDetails h3 {
          margin: 0 0 3px;
          font-size: 13px;
          font-weight: 750;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .propertyLocation {
          margin: 0 0 5px;
          font-size: 10px;
          opacity: .88;
        }

        .propertyMeta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          font-size: 9px;
        }

        .propertyPrice {
          font-weight: 800;
        }

        .overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: transparent;
        }

        .modal {
          width: 100%;
          max-width: 445px;
          position: relative;
          overflow: hidden;
          border-radius: 27px;
          padding: 31px 30px 22px;
          background: rgba(255,255,255,.98);
          border: 1px solid rgba(255,255,255,.85);
          box-shadow:
            0 45px 110px rgba(0,0,0,.30),
            0 12px 35px rgba(0,0,0,.10);
          animation: modalIn .25s cubic-bezier(.2,.8,.2,1);
        }

        .modal::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 3px;
          background:
            linear-gradient(
              90deg,
              #ff9f43,
              #f97316,
              #ffb15c
            );
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(.975);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .close {
          position: absolute;
          top: 17px;
          left: 17px;
          width: 33px;
          height: 33px;
          border-radius: 50%;
          border: 1px solid #e4dfd9;
          background: #fff;
          display: grid;
          place-items: center;
          z-index: 5;
        }

        .close:hover {
          background: #fff7ed;
          border-color: #f97316;
        }

        .close svg {
          width: 16px;
          fill: none;
          stroke: #333;
          stroke-width: 1.7;
        }

        .loginHeader {
          text-align: center;
          padding: 8px 20px 23px;
        }

        .miniLogo {
          width: 45px;
          height: 45px;
          margin: 0 auto 15px;
          border-radius: 15px;
          display: grid;
          place-items: center;
          color: #f97316;
          background:
            linear-gradient(
              145deg,
              #fff7ed,
              #ffedd5
            );
          box-shadow:
            0 8px 20px rgba(249,115,22,.12);
        }

        .miniLogo svg {
          width: 20px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.6;
        }

        .loginHeader h2 {
          margin: 0;
          color: #202020;
          font-family: Georgia, serif;
          font-size: 27px;
          font-weight: 500;
          letter-spacing: -.5px;
        }

        .loginHeader p {
          margin: 9px 0 0;
          color: #77716c;
          font-size: 13px;
          line-height: 1.55;
        }

        .guestBadge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
          padding: 6px 11px;
          border-radius: 999px;
          background: #fff7ed;
          color: #ea580c;
          font-size: 10px;
          font-weight: 750;
        }

        .field {
          margin-bottom: 15px;
        }

        .label {
          display: block;
          margin-bottom: 7px;
          color: #373330;
          font-size: 12px;
          font-weight: 750;
        }

        .input {
          height: 55px;
          display: flex;
          align-items: center;
          padding: 0 14px;
          border-radius: 12px;
          background: #fff;
          border: 1px solid #cec8c2;
          box-shadow: 0 2px 7px rgba(0,0,0,.025);
          transition: .18s;
        }

        .input:focus-within {
          border-color: #f97316;
          box-shadow:
            0 0 0 3px rgba(249,115,22,.075),
            0 5px 15px rgba(0,0,0,.035);
        }

        .input svg {
          width: 18px;
          height: 18px;
          margin-right: 10px;
          flex-shrink: 0;
          fill: none;
          stroke: #77716d;
          stroke-width: 1.7;
        }

        .input:focus-within svg {
          stroke: #f97316;
        }

        .input input {
          flex: 1;
          min-width: 0;
          height: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #222;
          font-size: 14px;
        }

        .input input::placeholder {
          color: #aaa39d;
        }

        .passwordToggle {
          border: 0;
          background: transparent;
          color: #77716d;
          font-size: 11px;
          font-weight: 700;
          padding: 4px;
        }

        .error {
          margin-bottom: 12px;
          padding: 9px 10px;
          border-radius: 9px;
          border: 1px solid #f0d5da;
          background: #fff2f4;
          color: #a63c51;
          font-size: 11px;
          line-height: 1.45;
        }

        .continue {
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 51px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: 0;
          border-radius: 12px;
          color: white;
          background:
            linear-gradient(
              135deg,
              #ff9f43 0%,
              #f97316 50%,
              #ff9f43 100%
            );
          background-size: 200% 100%;
          font-size: 14px;
          font-weight: 750;
          box-shadow:
            0 10px 25px rgba(249,115,22,.19);
          transition:
            transform .18s,
            box-shadow .18s;
        }

        .continue:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow:
            0 13px 29px rgba(249,115,22,.25);
        }

        .continue:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .continue svg {
          width: 17px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.8;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 19px 0 15px;
          color: #aaa29b;
          font-size: 11px;
        }

        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #dfd9d3;
        }

        .socialIcons {
          display: flex;
          justify-content: center;
          gap: 18px;
        }

        .socialIcon {
          width: 45px;
          height: 45px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid #ddd7d1;
          background: #fff;
          color: #222;
          font-weight: 800;
        }

        .socialIcon:hover {
          background: #faf8f5;
          border-color: #c9c2bb;
        }

        .footer {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #ebe6e0;
          text-align: center;
          color: #817b75;
          font-size: 11px;
        }

        .footer button {
          border: 0;
          padding: 0;
          background: transparent;
          color: #393532;
          font-weight: 700;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .footer button:hover {
          color: #f97316;
        }

        .hostLink {
          margin-top: 10px;
          font-size: 10px;
          color: #aaa39d;
        }

        .hostLink button {
          border: 0;
          background: transparent;
          color: #f97316;
          font-weight: 700;
          padding: 0;
        }

        @media (max-width: 480px) {
          .propertyCard {
            width: 190px;
            min-width: 190px;
            height: 135px;
          }

          .propertyRow {
            gap: 11px;
          }

          .modal {
            max-width: 100%;
            padding: 29px 20px 20px;
            border-radius: 23px;
          }

          .loginHeader h2 {
            font-size: 24px;
          }
        }
      `}</style>

      <div className="guestLoginPage">
        <div className="propertyBackground">
          {[0, 1, 2].map((row) => {
            const rowProperties = properties.slice(
              row * 7,
              row * 7 + 7
            );

            return (
              <div className="propertyRow" key={row}>
                {[...rowProperties, ...rowProperties].map(
                  (property, index) => (
                    <div
                      className="propertyCard"
                      key={`${row}-${index}`}
                    >
                      <img
                        src={property.image}
                        alt={property.name}
                      />

                      <div className="propertyDetails">
                        <h3>{property.name}</h3>

                        <div className="propertyLocation">
                          {property.location}
                        </div>

                        <div className="propertyMeta">
                          <span>
                            {property.type} • {property.guests}
                          </span>

                          <span className="propertyPrice">
                            {property.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>

        <div className="overlay">
          <div className="modal">

            <button
              className="close"
              type="button"
              onClick={() => navigate("/")}
              aria-label="Close"
            >
              <Icon type="close" />
            </button>

            <div className="loginHeader">

              <div className="miniLogo">
                <Icon type="user" />
              </div>

              <h2>Guest Login</h2>

              <p>
                Welcome back. Login to continue
                <br />
                with your Take On BnB booking.
              </p>

              <div className="guestBadge">
                <Icon type="user" />
                Guest Account
              </div>

            </div>

            <form onSubmit={handleLogin}>

              <div className="field">
                <label className="label">
                  Email address
                </label>

                <div className="input">
                  <Icon type="mail" />

                  <input
                    autoFocus
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError("");
                    }}
                    placeholder="Enter your email"
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">
                  Password
                </label>

                <div className="input">
                  <Icon type="lock" />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="passwordToggle"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="error">
                  {error}
                </div>
              )}

              <button
                className="continue"
                type="submit"
                disabled={
                  loading ||
                  !email.trim() ||
                  !password
                }
              >
                {loading
                  ? "Logging in..."
                  : "Login as Guest"}

                {!loading && (
                  <Icon type="arrow" />
                )}
              </button>
              <div
  style={{
    textAlign: "center",
    marginTop: "14px",
    marginBottom: "8px",
    color: "#999",
    fontSize: "11px",
  }}
>
  OR
</div>

{loginMode === "password" ? (
  <button
    type="button"
    onClick={() => {
      setLoginMode("otp");
      setError("");
    }}
    style={{
      width: "100%",
      height: "45px",
      borderRadius: "12px",
      border: "1px solid #ddd7d1",
      background: "#fff",
      color: "#f97316",
      fontSize: "13px",
      fontWeight: 700,
      cursor: "pointer",
    }}
  >
    Login with Phone OTP
  </button>
) : (
  <div>
    <div className="field">
      <label className="label">
        Phone Number
      </label>

      <div className="input">
        <input
          type="tel"
          value={phone}
          onChange={(event) => {
            setPhone(event.target.value);
            setError("");
          }}
          placeholder="+91 9876543210"
          disabled={otpLoading}
        />
      </div>
    </div>

    {!otpSent ? (
      <button
        type="button"
        className="continue"
        onClick={handleSendOTP}
        disabled={otpLoading || !phone.trim()}
      >
        {otpLoading
          ? "Sending OTP..."
          : "Send OTP"}
      </button>
    ) : (
      <>
        <div className="field">
          <label className="label">
            Enter OTP
          </label>

          <div className="input">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(event) => {
                setOtp(
                  event.target.value.replace(/\D/g, "")
                );
                setError("");
              }}
              placeholder="Enter 6-digit OTP"
              disabled={otpLoading}
            />
          </div>
        </div>

        <button
          type="button"
          className="continue"
          onClick={handleVerifyOTP}
          disabled={
            otpLoading ||
            !otp.trim()
          }
        >
          {otpLoading
            ? "Verifying..."
            : "Verify OTP"}
        </button>
      </>
    )}

    <button
      type="button"
      onClick={() => {
        setLoginMode("password");
        setOtpSent(false);
        setOtp("");
        setPhone("");
        setError("");
      }}
      style={{
        width: "100%",
        marginTop: "10px",
        border: "0",
        background: "transparent",
        color: "#777",
        fontSize: "11px",
        cursor: "pointer",
      }}
    >
      ← Back to Email Login
    </button>
  </div>
)}

            </form>

            <div className="divider">
              or
            </div>

            <div className="socialIcons">

              <button
                type="button"
                className="socialIcon"
                onClick={() =>
                  toast.info(
                    "Google login is coming soon."
                  )
                }
              >
                G
              </button>

              <button
                type="button"
                className="socialIcon"
                onClick={() =>
                  toast.info(
                    "Apple login is coming soon."
                  )
                }
              >
                
              </button>

            </div>

            <div className="footer">

              New to Take On BnB?{" "}

              <button
                type="button"
                onClick={() =>
                  navigate(
                    redirectParam
                      ? `/signup?redirect=${encodeURIComponent(
                          redirectParam
                        )}`
                      : "/signup"
                  )
                }
              >
                Create Guest Account
              </button>

              <div className="hostLink">
                Want to list your property?{" "}

                <button
                  type="button"
                  onClick={() =>
                    navigate("/host/login")
                  }
                >
                  Login as Host
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}
