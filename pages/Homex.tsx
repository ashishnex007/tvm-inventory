"use client";
import React from 'react'
import axios from "axios";
import logo from './next.svg';

declare global {
    interface Window {
        Razorpay: any;
    }
}

function Homex() {

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

    async function displayRazorpay() {
        try {
            const res = await loadScript(
                "https://checkout.razorpay.com/v1/checkout.js"
            );
    
            if (!res) {
                alert("Razorpay SDK failed to load. Are you online?");
                return;
            }
            
            const result = await axios.post("/api/payment/orders");

            if (!result) {
                alert("Server error. Are you online?");
                return;
            }

            const { amount, id: order_id, currency } = result.data;

            const options = {
                key: "rzp_test_SS49Ahe904DIC8", 
                amount: amount.toString(),
                currency: currency,
                name: "Laude Corp.",
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

                    alert(result.data.msg);
                },
                prefill: {
                    name: "Varun Laude",
                    email: "VarunMC@example.com",
                    contact: "9999999999",
                },
                notes: {
                    address: "Varun MC Corporate Office",
                },
                theme: {
                    color: "#61dafb",
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
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>Buy React now! 😂</p>
                <button className="App-link" onClick={displayRazorpay}>
                    Pay ₹500
                </button>
            </header>
        </div>
    );
}

export default Homex;