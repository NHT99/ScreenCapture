import "./App.css";
import { QRCodeSVG } from "qrcode.react";
import React, { useState, useCallback, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import layer from "./asset/UtopLogo.png";
import polygon from "./asset/Polygon1.png";
import mangset from "./asset/NewsLogo.png";
import rectangle from "./asset/Rectangle18922.png";
import axios from "axios";

function App() {
  const ref = useRef();
  var oldQrcode = "";
  let txtArr = "";
  var cvs = "";
  var sasToken,
    blobEndpoint = "";

  const [qrValue, setQrcode] = useState("");
  const [arr, setArr] = useState([]);
  const [paper, setPaper] = useState("");
  const [numberSpp, setNumberSpp] = useState("");
  const [token, setNewtoken] = useState("");
  const downloadTxt = (txt) => {
    const element = document.createElement("a");
    const file = new Blob([txt], {
      type: "text/plain",
    });

    element.href = URL.createObjectURL(file);
    element.download = "myFile.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };
  const totalQr = useRef(0);
  const arrRef = useRef([]);

  const getToken = async () => {
    axios({
      method: "GET",
      url: `https://api.utop.vn/Business/StorageToken?type=3`,
      headers: {
        "content-type": "application/json",
        "X-Environment": "qa",
        Authorization:
          "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjZlZmM2OTZkOWZiNGRiYWRlMGNjNGVmZjQ3ZDBkMGYwIiwidHlwIjoiSldUIn0.eyJuYmYiOjE2NTYzMDMzNjAsImV4cCI6MTY1OTkwMzM2MCwiaXNzIjoiaHR0cHM6Ly91dG9wLWF1dGgtcWEuYXp1cmV3ZWJzaXRlcy5uZXQiLCJhdWQiOlsiaHR0cHM6Ly91dG9wLWF1dGgtcWEuYXp1cmV3ZWJzaXRlcy5uZXQvcmVzb3VyY2VzIiwiYXBpMSJdLCJjbGllbnRfaWQiOiJpbnNpZ2h0X3BvcnRhbCIsInN1YiI6ImU4NmExZTgwLWIyYTUtNDM5MC1hNzAyLThiYmZlMzMyY2ZlMiIsImF1dGhfdGltZSI6MTY1NjMwMzM2MCwiaWRwIjoibG9jYWwiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwiZW1haWwiLCJhcGkxLnJlYWQiXSwiYW1yIjpbInB3ZCJdfQ.MYwDuVu5nc2EqT-VCII_MvEXEJGzX7Scaf-j6rXMukG5nwuO3VyqWFccHn575rCzBKP2yC-SXa6bWKop3la0M2Lhyy-PHLPeo81A5Yp_w_5LDY5rH0-YL-uI9jEwKg-93f_tjOSenj1nCH3PKf4dUpRMAR31tLXOtZzeeaM0PqJTjqRvfFi-a9PfjINRxypRoNmCgzWeCQ0ZDrSzhWTOrfc5_HJjuXwOR-TiacYBl-1GELI6LQyjxNBP2qBRO-yaBMlCu6GYrkbC52fBLqTNeg8MxDKzSRrWqOl71whZvkhrzDc5evjUGcsBZ0dN6xj846mKxX6ADbmIWei64t5ruw",
        // `Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjZlZmM2OTZkOWZiNGRiYWRlMGNjNGVmZjQ3ZDBkMGYwIiwidHlwIjoiSldUIn0.eyJuYmYiOjE2NTA1MzQ4MTgsImV4cCI6MTY1NDEzNDgxOCwiaXNzIjoiaHR0cHM6Ly91dG9wLWF1dGgtcWEuYXp1cmV3ZWJzaXRlcy5uZXQiLCJhdWQiOlsiaHR0cHM6Ly91dG9wLWF1dGgtcWEuYXp1cmV3ZWJzaXRlcy5uZXQvcmVzb3VyY2VzIiwiYXBpMSJdLCJjbGllbnRfaWQiOiJpbnNpZ2h0X3BvcnRhbCIsInN1YiI6IjczZDUyODkzLWU1YmItNGY5Mi1hZGYzLTM2M2VkYWM0NDY4NSIsImF1dGhfdGltZSI6MTY1MDUzNDgxOCwiaWRwIjoibG9jYWwiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwiZW1haWwiLCJhcGkxLnJlYWQiXSwiYW1yIjpbInB3ZCJdfQ.LdR3cjqTqVH7AjqdeplonaqqGmcNvFbmfDPceX10l1reIq7FkggKHOKP6q2OW4fT8iXESscMP0xz3gshtwp0lqktNZd7TJkO53fajWHa2-Ed_4-lpklPXlzeNS0XzGaliDGVG5pQSoX55aTzJyTeZXZK2veJ-N7jQL1v3p9cZyNng1OpF3PjQ8REcDWqQ-kum7XbMt2789NdBPYMNt_b5ImSNN1S7gJ1gh9pJFapq4sfAM-vraUMLLomGLl0NAxq-y5zHmZtgiQNZVDCo81BYMbFFGZWSMgug0UMuSMLkEXI3ngFRe0SLBNDM6KWuea7Gk6igOeOrBFdXH4WM4uEkQ`,
        "Ocp-Apim-Subscription-Key": "24632433ef3a4e0ba4df7bd1c7cb2014",
      },
    })
      .then(function (response) {
        sasToken = response.data.sasToken;
        blobEndpoint = response.data.blobEndpoint;
      })
      .catch(function (response) {
        Swal.fire({
          icon: "error",
          title: "Ốii...",
          text: "Token insight portal had expried!",
        });
      });
  };
  const uploadFile = async (fd, name) => {
    console.log("name", name);
    axios({
      method: "put",
      url: `${blobEndpoint}/voucher/${name}?${sasToken}`,
      data: fd[1],
      headers: {
        "content-type": "image/jpg",
        "Access-Control-Allow-Origin": "*",
        "x-ms-blob-type": "BlockBlob",
      },
    })
      .then(function (response) {
        txtArr += `${blobEndpoint}/voucher/${name}\n`;
        totalQr.current += 1;
        if (arrRef.current.length === totalQr.current) {
          downloadTxt(txtArr);
        }
      })
      .catch(function (response) {
        console.log("axios error", response);
      });
  };

  const onChange = (e) => {
    var file = e.target.files[0];
    if (!file) return;
    var FR = new FileReader();
    FR.onload = (e) => {
      try {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: "array" });
        var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        var result = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        setArr(result);
        arrRef.current = result;
      } catch (error) {
        console.log(error);
      }
    };
    FR.readAsArrayBuffer(file);
  };

  useEffect(() => {
    getToken();
  }, []);
  useEffect(() => {
    ref.current = qrValue;
  }, [qrValue]);
  const genQRCode = useCallback(
    (array, currentIndex) => {
      if (currentIndex >= array.length) {
        return;
      }
      var value = array[currentIndex];
      setQrcode(value);
      oldQrcode = value;

      const itv = setInterval(() => {
        if (oldQrcode === ref.current) {
          clearInterval(itv);

          var w = 420 * 3;
          var h = 596 * 3;
          var div = document.querySelector(".content");
          var canvas = document.createElement("canvas");
          canvas.width = w * 2;
          canvas.height = h * 2;
          canvas.style.width = w + "px";
          canvas.style.height = h + "px";
          var context = canvas.getContext("2d");
          context.scale(6, 6);
          html2canvas(div, { canvas: canvas }).then(function (canvas) {
            cvs = canvas.toDataURL("image/jpg");
            const base64 = cvs;
            fetch(base64)
              .then((res) => res.blob())
              .then((blob) => {
                const file = new File([blob], `${ref.current}.png`, {
                  type: "image/png",
                });
                var fd = new FormData();
                fd.append("image", file);
                for (var p of fd) {
                  uploadFile(p, btoa(unescape(encodeURIComponent(p[1].name))));
                }
              });
          });

          setTimeout(() => {
            genQRCode(array, ++currentIndex);
          }, 1000);
        }
      }, 200);
    },
    [qrValue]
  );

  return (
    <>
      <div className="app">
        <header className="App-header"></header>
        <body>
          <form id="myForm">
            <input
              type="file"
              className="input-field"
              accept=".csv, .xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={onChange}
              multiple
            />
          </form>

          <div id="myDiv">
            <p>Tên báo </p>
            <input
              type="text"
              maxLength={70}
              onChange={(e) => {
                setPaper(e.target.value);
              }}
            />

            <p>Số kỳ báo</p>
            <input
              type="text"
              maxLength={60}
              onChange={(e) => {
                setNumberSpp(e.target.value);
              }}
            />
          </div>

          <br />
          <div>
            <button
              onClick={async () => {
                console.log(arr);
                genQRCode(arr, 0);
              }}
            >
              Gen QR
            </button>
          </div>
          <button
            onClick={() =>
              (async () => {
                const { value: token } = await Swal.fire({
                  title: "Insight token",
                  input: "text",
                  inputPlaceholder: "Enter insight portal token",
                });

                if (token) {
                  Swal.fire(`Entered token: ${token}`);
                  
                }
              })()
            }
          >
            Authorize
          </button>

          <div className="content">
            <img className="layer" src={layer} alt="layer" />
            <img className="mangset" src={mangset} alt="mangset" />
            <div className="used">
              <div className="tutorial">
                <p>HƯỚNG DẪN SỬ DỤNG</p>
              </div>

              <div className="step">
                <img src={polygon} alt="tutorial" />
                <p>
                  Bước 1: Truy cập website: https://thieuniennhidong.utop.vn
                </p>
              </div>
              <div className="step">
                <img src={polygon} alt="tutorial" />
                <p>
                  Bước 2: Đăng nhập với mã OTP được gửi về số điện thoại của
                  bạn.
                </p>
              </div>
              <div className="step">
                <img src={polygon} alt="tutorial" />
                <p>Bước 3: Nhấn nút "NHẬP MÃ VOUCHER" trên thanh điều hướng.</p>
              </div>
              <div className="step">
                <img src={polygon} alt="tutorial" />
                <p>
                  Bước 4: Nhập mã Voucher bên dưới và kiểm tra thông tin gói
                  báo.{" "}
                </p>
              </div>
              <div className="step">
                <img src={polygon} alt="tutorial" />
                <p>Bước 5: Kích hoạt và trải nghiệm đọc báo.</p>
              </div>
            </div>

            <div id={"capture"}>
              <QRCodeSVG
                value={qrValue.toString()}
                size={100}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
                includeMargin={false}
              />
            </div>
            <div className="voucherCode">
              <p className="title">Mã voucher:</p>
              <img src={rectangle} alt="rectangle" />
              <p className="showVoucher">{qrValue}</p>
            </div>
            <div className="paper">
              <div className="paperName">
                <p>{paper}</p>
              </div>
              <div className="numberSpp">
                <p>{numberSpp}</p>
              </div>
            </div>
          </div>
        </body>
      </div>
    </>
  );
}
export default App;
