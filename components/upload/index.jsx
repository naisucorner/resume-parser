import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const Upload = () => {
  const [parseData, setParseData] = useState();
  const [parseLoading, setParseLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    skills: [],
    education: [],
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
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        skills: res?.data?.skills ?? [],
        address: res?.data?.address,
        education: res?.data?.education,
      }));
      setParseLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.error ?? "Something went wrong!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      setParseLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full py-8 bg-grey-lighter">
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
            <span className="mt-2 text-base font-medium leading-normal">
              Select a resume
            </span>
          )}

          <input type="file" className="hidden" onChange={handleFileInput} />
        </label>

        <textarea
          className="mt-8 w-full border border-gray-300 h-[250px] p-4 resize-none rounded-md"
          value={parseData}
        />

        <div className="flex flex-col items-center justify-center w-full p-4 mt-8 bg-gray-300">
          <div className="mb-4 text-xl font-bold">Overview</div>

          <div className="grid w-full grid-cols-5 border border-gray-50">
            <div className="col-span-1 px-4 py-2 font-bold bg-gray-200">
              Name:
            </div>
            <div className="col-span-4 px-4 py-2 bg-gray-400">{data.name}</div>
          </div>

          <div className="grid w-full grid-cols-5 border border-gray-50">
            <div className="col-span-1 px-4 py-2 font-bold bg-gray-200">
              Email:
            </div>
            <div className="col-span-4 px-4 py-2 bg-gray-400">{data.email}</div>
          </div>

          <div className="grid w-full grid-cols-5 border border-gray-50">
            <div className="col-span-1 px-4 py-2 font-bold bg-gray-200">
              Phone:
            </div>
            <div className="col-span-4 px-4 py-2 bg-gray-400">{data.phone}</div>
          </div>

          <div className="grid w-full grid-cols-5 border border-gray-50">
            <div className="col-span-1 px-4 py-2 font-bold bg-gray-200">
              Address:
            </div>
            <div className="col-span-4 px-4 py-2 bg-gray-400">
              {data.address}
            </div>
          </div>

          <div className="grid w-full grid-cols-5 border border-gray-50">
            <div className="col-span-1 px-4 py-2 font-bold bg-gray-200">
              Skills:
            </div>
            <div className="col-span-4 px-4 py-2 bg-gray-400">
              {data.skills.join(", ")}
            </div>
          </div>

          {/* <div className="grid w-full grid-cols-5 border border-gray-50">
            <div className="col-span-1 px-4 py-2 font-bold bg-gray-200">
              Education:
            </div>
            <div className="col-span-4 px-4 py-2 bg-gray-400">
              {data.skills.join(", ")}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Upload;
