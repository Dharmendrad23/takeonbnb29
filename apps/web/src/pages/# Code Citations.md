# Code Citations

## License: unknown
https://github.com/Metis-IITGandhinagar/insiit-ui-react-native/blob/f5db483ba0087f9f46a573a7dd637f4c3dc3a8b3/screens/messForgotPasswordScreen.tsx

```
Perfect, ab clear ho gaya. Neeche **complete replacement** hai `HostRegisterPage.jsx` ke liye — Email → OTP → Password flow ke sath (name is optional field bhi rakha hai, but flow OTP-first hai).

````jsx
// filepath: node_modules\web\src\pages\HostRegisterPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { User, Mail, Lock, Loader2, KeyRound } from "lucide-react";

const HostRegisterPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("email"); // "email" -> "otp" -> "password"

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("
```


## License: unknown
https://github.com/Metis-IITGandhinagar/insiit-ui-react-native/blob/f5db483ba0087f9f46a573a7dd637f4c3dc3a8b3/screens/messForgotPasswordScreen.tsx

```
Perfect, ab clear ho gaya. Neeche **complete replacement** hai `HostRegisterPage.jsx` ke liye — Email → OTP → Password flow ke sath (name is optional field bhi rakha hai, but flow OTP-first hai).

````jsx
// filepath: node_modules\web\src\pages\HostRegisterPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { User, Mail, Lock, Loader2, KeyRound } from "lucide-react";

const HostRegisterPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("email"); // "email" -> "otp" -> "password"

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 1: send OTP to
```

