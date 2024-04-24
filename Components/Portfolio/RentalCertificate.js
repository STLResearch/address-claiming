import { useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { calculateTimeDifference, formatDate, getFormattedDate } from '@/utils';
import Image from 'next/image';

const generatePDF = (airspace) => {
  const element = document.querySelector('.pdf-content');




  html2canvas(element).then((canvas) => {


    var doc = new jsPDF();


doc.addImage("/images/logo.png", "PNG", 80, 10, null, null, "center");


doc.setFont("helvetica", "bold");
doc.setTextColor('#808080'); 
doc.text("RENTAL CERTIFICATE", 105, 40, null, null, "center");
doc.setTextColor('#000000'); 

doc.setFont("helvetica", "normal");
doc.setFontSize(12)
doc.text(`${getFormattedDate()}`, 20, 50);


doc.text("This certifies that [User's Name] has successfully rented an airspace on SkyTrade for", 20, 60);
doc.text("the following details:", 20, 65)

doc.text(`Rental ID: ${airspace.id}`, 20, 75)
doc.text(`Date of Rental: ${formatDate(airspace.metadata.startTime)}`, 20, 80)
doc.text(`Time Frame: ${calculateTimeDifference(airspace.metadata.startTime, airspace.metadata.endTime)}`, 20, 85)
doc.text(`Address: ${airspace.address}`, 20, 90)
doc.text(`Transaction Hash:`, 20, 95)
doc.text(`Transaction Date:`, 20, 100)
doc.text(`Amount:`, 20, 105)



doc.text("This rental agreement is valid for the specified date and time frame mentioned above", 20, 115);
doc.text("and subject to SkyTrade's Rental Agreement and Terms of Service.", 20, 120);

doc.text("SkyTrade Team", 20, 135);

doc.setFont("helvetica", "bold");
doc.text("www.sky.trade", 20, 140);

doc.addImage("/images/cert.png", "PNG", 0, 170, null, null, "right")

doc.save('rental_certificate.pdf');
  });
};


const RentalCertificate = ({rentalData, onCloseModal, airspace}) => {
  // useEffect to generate PDF on component mount
  useEffect(() => {
    generatePDF(airspace);
  }, []);




  return (
    <div className="pdf-content w-[36rem] bg-white py-20 min-h-screen relative text-sm">


              
    </div>
  );
};

export default RentalCertificate;


