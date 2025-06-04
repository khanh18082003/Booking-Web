import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "../../configuration/axiosCustomize";

const Authentication = () => {
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log(window.location.href);

    const authCodeRegex = /code=([^&]+)/;
    const isMatch = window.location.href.match(authCodeRegex);

    if (isMatch) {
      const authCode = isMatch[1];
      console.log("Authentication code:", authCode);
      // Gọi API với authCode
      callAuthenticationAPI(authCode);
    }
  }, []);

  const callAuthenticationAPI = async (authCode) => {
    try {
      setIsLoading(true);
      // Sử dụng params thay vì body
      const response = await axios.post(
        `/auth/outbound/authentication?code=${authCode}`,
      );
      if (response && response.data && response.data.data) {
        localStorage.setItem("accessToken", response.data.data.access_token);
        setIsLoggedin(true);
      }
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedin) {
      navigate("/");
    }
  }, [isLoggedin, navigate]);

  return (
    <div>{isLoading ? <p>Đang xác thực...</p> : <p>Authentication</p>}</div>
  );
};

export default Authentication;
