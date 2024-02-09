let zlib = require("zlib")

function compress(req, res, next) {
  const originalSend = res.send
  res.send = function (data) {
    if (res.headersSent) {
      console.log("Data already sent....")
      return originalSend.call(res, data)
    }
    if (typeof data === "object" && !Buffer.isBuffer(data)) {
      if (req.acceptsEncodings("gzip")) {
        const compressedData = zlib.gzipSync(JSON.stringify(data))

        res.setHeader("Content-Encoding", "gzip")
        res.setHeader("Content-Type", "application/json")
        res.setHeader("Content-Length", compressedData.length)

        res.end(compressedData)
      } else {

        originalSend.call(res, data)
      }
    } else {
      originalSend.call(res, data)
    }
  }

  next()
}

module.exports = { compress }
