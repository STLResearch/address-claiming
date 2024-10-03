import React from "react";
import { Document, StyleSheet, Image as Img, Page, Text, View } from "@react-pdf/renderer";

const TransferCertificate = ({ user, auctionId, dateOfTransfer, longitude, latitude, amount, address }) => {
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#fff",
      paddingRight: 30,
      paddingLeft: 30,
      paddingTop: 10,
      paddingBottom: 10,
    },
    title: {
      fontSize: 16,
      textAlign: "center",
      fontWeight: "bold",
      marginBottom: 10,
    },
    section: {
      margin: 10,
      paddingVertical: 10,
      fontSize: 12,
      lineHeight: 1.5,
    },
    bold: {
      fontWeight: "bold",
    },
    footer: {
      fontSize: 12,
      marginTop: 30,
      paddingHorizontal: 10,
    },
    image: {
      width: 200,
      height: 60,
      marginVertical: 20,
      margin: "right",
    },
    mb: {
      marginTop: 10,
    },

    mapImage: {
      margin: "auto",
      width: 450,
      height: 300,
      marginVertical: 10,
    },
  });

  return (
    <Document>
      <Page style={styles.page}>
        <Img style={styles.image} src={"/images/logwo.png"} />
        <Text style={styles.title}>Airspace Transfer Certificate</Text>
        <View style={styles.section}>
          <Text>
            This certifies that {user.name}, with the blockchain address {user.blockchainAddress}, has successfully won
            the airspace auction and is now the legal owner of the airspace on SkyTrade with the following details:
          </Text>
          <Text style={[styles.bold, styles.mb]}></Text>
          <Text style={styles.bold}>Address : {address}</Text>
          <Text style={styles.bold}>Date of Transfer: {dateOfTransfer}</Text>
          <Text style={styles.bold}>Total Amount: ${amount}</Text>
        </View>

        <Img
          style={styles.mapImage}
          src={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${longitude},${latitude},14/600x600?access_token=${process.env.NEXT_PUBLIC_MAPBOX_KEY}`}
        />

        <View style={styles.section}>
          <Text>
            {`The ownership of the above-specified airspace has been successfully transferred to {user.name} on the
            blockchain. This ownership is governed by SkyTrade's Terms of Service.`}
          </Text>

          <Text>
            {`For any questions regarding the airspace or its use, please contact SkyTrade's support team for assistance.`}
          </Text>
        </View>
        <View style={styles.footer}>
          <Text>SkyTrade Team</Text>
          <Text>Website: https://app.sky.trade</Text>
          <Text>E-mail: info@sky.trade</Text>
        </View>
      </Page>
    </Document>
  );
};

export default TransferCertificate;
