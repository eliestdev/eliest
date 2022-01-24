import React from "react";
import {
  Page,
  PDFViewer,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import colors from "tailwindcss/colors";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    width: "100%",
    flexWrap: "wrap",
  },
  section: {
    margin: 5,
    padding: 10,
    border: "1px sold #fafafa",
    width: "23%",
  },
});

// Create Document Component
const MyDocument = () => {
  let vouchers = JSON.parse(sessionStorage.getItem("c_vouchers")) || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {vouchers.map((item) => (
          <View style={styles.section}>
            <View>
              <View>
                <Image style={{ height: 20, width: 32 }} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAAoCAMAAAB5EAzbAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAEgUExURQCmTmK0eCGzagGoUgCoUgWrWCm2bwGpUxCvYDx9WwerWASrVwCnUACnUC24cgusW/SGIgesWgGoUwOqVgesWQGpVAarWDw4OQGoUvSGIgCnTwGpUhuyZgCnTwKpVAarWACnUDk1NvabShKvYAmsWwarWQGoUvWQNfaVPz05Oz05OvWMLgGoUgGpU/WOMTYyMzk1NgmsWgesWQCnUACoUQ2uXgarWPWMLjYzNENAQfSJKD87PDg0NfSGIQGpUwGpUwKpVACnT/eOMPSGIvWLLPSHIzc0NTAuL/SGIvWQNfSFIEVCQzw5OjUxMvWMLQCoUfSKKvSKKveLLPSIJUI/PwOqVQGpU/SJKPSIJvSGITczNBioYGL//zv/AGL//0dwTG50mK0AAABgdFJOU/8CDpzKaQugKAQebeLqByKTQph0SaU2NMSk964S+4Vj50IGGDNPxyENLSY3urMUOUxWPd3XL1xEXx12F1PPqpGL8yqyT491EZoY4QsiaS/QWWAmhwmAxGyAwYFMAgQCAMJSEkwAAAOKSURBVEjHzZZpc6JKFIYPKCqiGARERHBXXHDft7gnTvZM1nur0v//X0yDYmLi1I13vkxXaTd9up4+y9s0gP6wwd8JIPYfB5XKWT4xQBeFC6lH5+nCmZS4rPTyefoggE1rjAmJicJ2ptLtdoeFfE+6qiSG0mqwKhSuhisp3x0cALCZsR/ceBDwQZbcAq5W1erD5cVDNSF1V/8MqpcVqZDoJqqHPHAJ/BQceBAtqQ52M1e4zEvVIfZe6g0TvcRFfiCdFYaJq+rDwRCiTQtApOrRj2l5sDJD28/pfxFNH04i6bQA/9GCzG+r8C0A5/8KIOjPgF01d47bI48TqE+AFi8awRr5DmBD2mYTD+82gm0zHwQ3cQcZgYkKNwBiOxZ6B7D8kxab+NWxdwtga8qmmjT1NIlpPjACCDE3TEgQI08tTYlA1uFovwP4Zh3/Z6YgujYAq5omgGqYcuLiYLhacd7cy511IY9/P4SNCb0pMOXsEMgbE+DxTaxlIqgCBdaqkEF+AWgqlQ6FQukxwKMNcGVNAA+8ZREBNB4sP8nYFw/YkqoEzeYeK+0dIIwBtAGGbYlxU4hPWjgtxB4AFybVjNSxrmiawG0PQGZVYWdhHyMA8dOWWZkPgDOEvA3IfBHSBuCE9ruFrmVVAF+M+AxINWFiryH3ADgRtippUwnRmBNgmtkDYLmxBjQ8W4nG9nOgQDy9sYSoNJYCSmlTUN4+JZHgAZSUdRLH3B4AUQClgBWYO8NYyiQckHVhwN5ZCDQBwjVPgDNsIdmAFHbZ2cYWxWAZp7UJBaL5tjlFZM21U2LGDxCJ+9Qbj6kdCON4Aw2r43wAatwXaaYRAyJWukv0Yy+zuBwi9eEwCWFcoqnRwofA3fA1Tmttq8MyrpemGF4KmapuOE+1cdisWKYZiT+6Pp7GKEdRdTxDeANer/mzuhROMVmnKM48pimvV2D4jBUH8nIe4vv3wv3szy6W3Hy5e+skEUoefzOdnNijzgytF/8PUC4WdVR8vb1fyvfJ5HUxdyTg+qXTl3OLH/3OfN5Z928X88VRAFq+Q8n5cj0qop8n6E4m0PNofQRgmfvRQehlNNsAZBzStTlzDOAWoefX3BYg49Li4REhvMlyEi2f16OF/lPW70Yz1Jnr3waUz8/X93L/rq8nz+Xi4vW5/HJ+27/+fhKT5XIS6bMcVpC+Joi1jojcTP+7v5GOab8AY9TCnfRZyccAAAAASUVORK5CYII=" />
                <Text style={{ fontSize: 6, margin: 2 }}>
                  Amount: {item.amount}
                </Text>
                <Text style={{ fontSize: 10, margin: 2 }}>
                  Code: {item.code}
                </Text>
                <Text style={{ fontSize: 6, margin: 2, color: "black" }}>
                  Serial: {item.batch.split("-")[0]}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

const App = () => (
  <>
    <div
      style={{
        marginBottom: 12,
        alignSelf: "center",
        justifyContent: "center",
        display: "flex",
      }}
    >
      <PDFDownloadLink
        document={<MyDocument />}
        fileName="vouchers.pdf"
        style={{
          padding: 5,
          backgroundColor: "black",
          color: "white",
          marginBottom: 10,
          alignSelf: "center",
          fontWeight: "bold",
        }}
      >
        {({ blob, url, loading, error }) =>
          loading ? "Loading document..." : "Download now!"
        }
      </PDFDownloadLink>
    </div>
    <PDFViewer style={{ width: "100vw" }}>
      <MyDocument />
    </PDFViewer>
    <style></style>
  </>
);

export default App;
