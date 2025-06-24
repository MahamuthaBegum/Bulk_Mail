import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function App() {
  const [msg, setmsg] = useState("")
  const [status, setstatus] = useState(false)
  const [emailList, setEmailList] = useState([])

  function handlemsg(evt) {
    setmsg(evt.target.value);
  }

  function handlefile(event) {
    const file = event.target.files[0]
    const reader = new FileReader()

reader.onload = function (event) {
  const data = event.target.result
  const workbook = XLSX.read(data, { type: "binary" })
  const sheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[sheetName]
  const emailList = XLSX.utils.sheet_to_json(worksheet, { header: 'A' })
  const totalemail = emailList.map(function(item){return item.A})
  console.log(totalemail)
  setEmailList(totalemail)
}
    reader.readAsBinaryString(file);
  }
  function send() {
    setstatus(true)
    axios.post("http://localhost:5000/sendemail", { msg:msg, emailList:emailList })
      .then(function (data) {
        if (data.data === true) {
          alert("Email send successfully")
          setstatus(false)
        }
        else {
          alert("Failed")
        }
      })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-pink-500 to-yellow-300 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 via-pink-700 to-yellow-500 text-white text-center shadow-lg">
        <h1 className="text-3xl font-bold px-5 py-6 tracking-wide">BulkMail</h1>
        <p className="text-pink-100 text-lg pb-4">Send personalized emails to your audience in one click</p>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 justify-center items-center">
        <div className="bg-white/80 rounded-xl shadow-2xl p-8 w-full max-w-xl flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-purple-900 mb-4">Compose Your Message</h2>
          <textarea
            onChange={handlemsg}
            value={msg}
            className="w-full h-32 py-2 px-3 outline-none border border-pink-300 rounded-md focus:ring-2 focus:ring-pink-400 transition mb-6 resize-none"
            placeholder="Enter the email text..."
          />

          <div className="w-full flex flex-col items-center mb-4">
            <label className="w-full flex flex-col items-center px-4 py-6 bg-pink-100 text-pink-700 rounded-lg shadow-md tracking-wide border border-pink-300 cursor-pointer hover:bg-pink-200 transition">
              <span className="mb-2 text-base leading-normal">Upload Excel File (.xlsx)</span>
              <input type="file" onChange={handlefile} className="hidden" />
            </label>
            <p className="mt-2 text-purple-800 text-sm">Total Emails in the file: <span className="font-bold">{emailList.length}</span></p>
          </div>

          <button
            onClick={send}
            disabled={status || !msg || emailList.length === 0}
            className={`mt-4 py-2 px-8 text-white font-semibold rounded-md shadow-lg transition
              ${status || !msg || emailList.length === 0
                ? "bg-pink-300 cursor-not-allowed"
                : "bg-pink-600 hover:bg-purple-700"}
            `}
          >
            {status ? "Sending..." : "Send"}
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-900 via-pink-700 to-yellow-500 text-pink-100 text-center py-4 mt-8">
        <p className="text-sm">&copy; {new Date().getFullYear()} BulkMail. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
