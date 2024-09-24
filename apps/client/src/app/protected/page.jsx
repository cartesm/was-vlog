"use client";
import Compresor from "compressorjs";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/test.hook";
import { jwtDecode } from "jwt-decode";
import cookies from "js-cookie";
function Page() {
  const [file, setFile] = useState(null);
  const { data, set } = useAuth();
  useEffect(() => {
    set(jwtDecode(cookies.get("was_auth_token")));
  }, []);

  const handlwChange = (event) => {
    setFile(event.target.files[0]);
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    new Compresor(file, {
      quality: 0.6,
      success: async (result) => {
        const formData = new FormData();
        formData.append("img", result);

        const resp = await axios.post(
          "http://localhost:3000/users/image",
          formData,
          {
            headers: {
              Authorization: "Bearer " + cookies.get("was_auth_token"),
            },
          }
        );
        console.info(resp);
      },
      error: (err) => {
        console.error(err.message);
      },
    });
  };
  return (
    <section>
      <p>PRROTECTED</p>
      <form action="" encType="multipart/form-data" onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".jpg , .jpge , .png"
          onChange={handlwChange}
        />
        <input type="submit" />
      </form>
      {data && <p>{data.username}</p>}
    </section>
  );
}

export default Page;
