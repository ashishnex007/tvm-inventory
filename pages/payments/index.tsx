"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import React, {useEffect, useState} from 'react';
import axios from "axios";
import logo from '../next.svg';
import QRCode from "react-qr-code";
import "../../app/globals.css";

declare global {
  interface Window {
      Razorpay: any;
  }
}

const Payments = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  //@ts-ignore
  const totalBill = searchParams.get('totalBill');
  //@ts-ignore
  const tabletQuantitiesString = searchParams.get('tabletQuantities');
  console.log(tabletQuantitiesString);

  const[QRString, setQRString] = useState();
  const[visible, setVisible] = useState(false);

  useEffect(() => {
    if (totalBill && typeof(totalBill) == "string") {
        const formattedTabletQuantities = formatTabletQuantities(tabletQuantitiesString);
        displayRazorpay(totalBill, formattedTabletQuantities);
    }
  }, [totalBill, tabletQuantitiesString]);

  //@ts-ignore
  function formatTabletQuantities(tabletQuantitiesString) {
    let tabletQuantities = [];
    let totalQuantity = 0;
    let formattedQuantities = '';
  
    if (tabletQuantitiesString) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(tabletQuantitiesString));
        tabletQuantities = parsedData.QR || [];
        //@ts-ignore
        totalQuantity = tabletQuantities.reduce((total, { qtd }) => total + parseInt(qtd), 0);
        formattedQuantities = tabletQuantities
        //@ts-ignore
          .map(({ name, qtd }) => `${name.toString().slice(-1)}:${qtd}`)
          .join(',');
      } catch (err) {
        console.error('Error parsing tabletQuantitiesString:', err);
      }
    }
  
    return `VALID ${totalQuantity}${tabletQuantitiesString || ''}${formattedQuantities},`;
  }

  function loadScript(src: any) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

async function displayRazorpay(totalBill : string, tabletQuantitiesString : string) {
    try {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }
        
        const result = await axios.post("/api/payment/orders", {totalBill});
        //@ts-ignore
        setQRString(tabletQuantitiesString);
        console.log(tabletQuantitiesString);

        if (!result) {
            alert("Server error. Are you online?");
            return;
        }

        const { amount, id: order_id, currency } = result.data;

        const options = {
            key: "rzp_test_SS49Ahe904DIC8", 
            amount: totalBill,
            currency: currency,
            name: "405 Inc.",
            description: "Test Transaction",
            image: { logo },
            order_id: order_id,
            handler: async function (response: any) {
                const data = {
                    orderCreationId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                };

                const result = await axios.post("/api/payment/success", data);

                if(result.data.msg === "success"){
                  setVisible(true);
                }

                alert(result.data.msg);
            },
            prefill: {
                name: "Varun Shah",
                email: "varun111103@gmail.com",
                contact: "9347222434",
            },
            notes: {
                address: "Team 405 Corporate Office",
            },
            theme: {
                color: "#000080",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again later.");
    }
}

  return (
    <div>
      <div className='flex justify-center items-center pt-60'>
        {visible &&
        <div>
          <h1 className="text-xl py-4">Show this QR Code to TVM to get your medicine</h1>
          <QRCode
            size={256}
            //@ts-ignore
            value={QRString}
            viewBox={`0 0 256 256`}
          />
        </div>
        }
      </div>
    </div>
  )
}

export default Payments;
