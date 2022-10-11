import axios from "axios";
import { useState } from "react";

const Upload = () => {
  const [parseData, setParseData] = useState();
  const [parseLoading, setParseLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    skills: [],
  });

  const handleFileInput = async (event) => {
    const [file] = event.target.files ?? [];

    if (!file) {
      return;
    }

    const formData = new FormData();

    formData.append("resume", file);

    try {
      setParseLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await axios({
        method: "post",
        url: "/api/parser",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setParseData(res.data.data);
      setData((data) => ({
        ...data,
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone,
        skills: res.data.skills,
        address: res.data.address,
      }));
      setParseLoading(false);
    } catch (error) {
      setParseLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full py-8 bg-grey-lighter flex-col">
      <div className="container flex flex-col items-center justify-center px-4">
        <label className="flex flex-col items-center w-64 px-4 py-6 tracking-wide uppercase bg-white border rounded-lg shadow-lg cursor-pointer text-blue border-blue">
          <svg
            className="w-8 h-8"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
          </svg>

          {parseLoading && (
            <div className="w-6 mt-2 h-6 ease-linear border-gray-600 rounded-full border-[3px] loader"></div>
          )}

          {!parseLoading && (
            <span className="mt-2 text-base leading-normal font-medium">
              Select a resume
            </span>
          )}

          <input type="file" className="hidden" onChange={handleFileInput} />
        </label>

        <textarea
          className="mt-8 w-full border border-gray-300 h-[250px] p-4 resize-none rounded-md"
          value={parseData}
        />

        <div className="w-full p-4 bg-gray-300 mt-8 flex flex-col justify-center items-center">
          <div className="font-bold mb-4 text-xl">Overview</div>

          <div className="w-full grid grid-cols-5 border border-gray-50">
            <div className="col-span-1 font-bold bg-gray-200 py-2 px-4">
              Name:
            </div>
            <div className="col-span-4 py-2 px-4 bg-gray-400">{data.name}</div>
          </div>

          <div className="w-full grid grid-cols-5 border border-gray-50">
            <div className="col-span-1 font-bold bg-gray-200 py-2 px-4">
              Email:
            </div>
            <div className="col-span-4 py-2 px-4 bg-gray-400">{data.email}</div>
          </div>

          <div className="w-full grid grid-cols-5 border border-gray-50">
            <div className="col-span-1 font-bold bg-gray-200 py-2 px-4">
              Phone:
            </div>
            <div className="col-span-4 py-2 px-4 bg-gray-400">{data.phone}</div>
          </div>

          <div className="w-full grid grid-cols-5 border border-gray-50">
            <div className="col-span-1 font-bold bg-gray-200 py-2 px-4">
              Address:
            </div>
            <div className="col-span-4 py-2 px-4 bg-gray-400">{data.address}</div>
          </div>

          <div className="w-full grid grid-cols-5 border border-gray-50">
            <div className="col-span-1 font-bold bg-gray-200 py-2 px-4">
              Skills:
            </div>
            <div className="col-span-4 py-2 px-4 bg-gray-400">
              {data.skills.join(", ")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
