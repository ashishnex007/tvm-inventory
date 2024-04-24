"use client";
import { Button, ButtonGroup, Card, CardBody, CardFooter, Divider, Heading, Image, Stack, Text, Input, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Tfoot, Td,  } from "@chakra-ui/react";
import {ChevronUpIcon, AddIcon, MinusIcon} from '@chakra-ui/icons';
import React, {useState} from "react";
import { useRouter } from 'next/navigation';

interface Tablet {
  id: number;
  src: string;
  name: string;
  desc: string;
  price: number;
}

declare global {
  interface Window {
      Razorpay: any;
  }
}

const tablets: Tablet[] = [
  { id: 2001, src:"https://5.imimg.com/data5/SELLER/Default/2022/9/IV/UY/CG/75459511/500mg-paracetamol-tablet.jpg", name: "Paracetamol", desc: "Quick relief from pain and fever for everyday ailments", price: 15 },
  { id: 2002, src:"https://5.imimg.com/data5/SELLER/Default/2021/6/MX/GY/RZ/11129789/paracetamol-650-mg-tablet.jpg", name: "Paracetamol 650", desc: "Extra strength for tougher pains and high fevers", price: 20 },
  { id: 2003, src:"https://www.krishlarpharma.com/wp-content/uploads/2019/12/KRITHRO-500-tablet.jpg", name: "Azithromycin", desc: "Fast-acting antibiotic tackles infections effectively", price: 100 },
  { id: 2004, src:"https://5.imimg.com/data5/SELLER/Default/2023/7/330506870/UM/GZ/QO/135658020/aspirin-dispersible-tablets.jpg", name: "Aspirin", desc: "Your go-to for pain, inflammation, and heart health", price: 10 },
];

const Tablets = () => {
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  // Update the quantity of a tablet
  const updateQuantity = (index: number, value: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [index]: value,
    }));
  };

const totalBill = Object.keys(quantities).reduce(
  (total, index) =>
    total +
      //@ts-ignore
    (parseInt(quantities[index]) || 0) * tablets[parseInt(index)].price,
  0
);

const getTabletQuantities = () => {
    //@ts-ignore
  const tabletQuantities = [];

  tablets.forEach((tablet, index) => {
    const quantity = quantities[index];
    if (quantity > 0) {
      tabletQuantities.push({ name: tablet.id, qtd: quantity.toString() });
    }
  });
    //@ts-ignore
  return tabletQuantities;
};

async function displayRazorpay() {
  try {
    if(totalBill === 0) {
      alert("Buy something man..");
      return;
    }

    const tabletQuantities = getTabletQuantities();
    const tabletQuantitiesString = JSON.stringify({ QR: tabletQuantities });
    console.log(tabletQuantitiesString);

    router.push(`/payments?totalBill=${totalBill}&tabletQuantities=${encodeURIComponent(tabletQuantitiesString)}`);

  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again later.");
  }
}

  return (
    <div>
      <div className="flex justify-evenly">
        {tablets.map((tablet, index) => (
          <Card key={index} maxW="xs" mb={8}>
            <CardBody>
              <div className="flex justify-center">
                <Image
                  src={tablet.src}
                  className="w-[9rem]"
                  alt="tablet"
                  borderRadius="lg"
                />
              </div>
              <Stack mt="6" spacing="3">
                <Heading size="md">{tablet.name}</Heading>
                <Text>{tablet.desc}</Text>
                <Text color="blue.600" fontSize="2xl">
                  ₹{tablet.price}
                </Text>
              </Stack>
            </CardBody>
            <Divider />
            <CardFooter>
              <div className="flex items-center">
                <Button colorScheme="blue" onClick={() => quantities[index] > 0 && updateQuantity(index, (quantities[index] || 0) - 1) }>
                  <MinusIcon />
                </Button>
                <div className="mx-4">
                  <Input width="9rem" size="lg" type="number" pattern="\d*" value={quantities[index] || ""} onChange={(e) => updateQuantity(index, parseInt(e.target.value))} />
                </div>
                <Button colorScheme="blue" onClick={() => updateQuantity(index, (quantities[index] || 0) + 1) } >
                  <AddIcon />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="bg-sky-200 w-screen h-[5rem] fixed bottom-0 flex justify-between">
        <div className="flex items-center">
          <h1 className="text-xl mx-4">Total Bill: {totalBill}</h1>
        </div>
        <div className="flex items-center">
          <Button onClick={onOpen} className="mx-4" style={{"backgroundColor":"#0891b2", color:"white"}}>
            View Bill Summary <ChevronUpIcon />
          </Button>

          <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Bill Summary</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Tablet name</Th>
                        <Th isNumeric>Unit price</Th>
                        <Th isNumeric>Quantity</Th>
                        <Th isNumeric>Overall Price</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {tablets.map((tablet, index) => {
                        const quantity = quantities[index] || 0;
                        const overallPrice = tablet.price * quantity;
                        if (quantity === 0) return null;
                        return (
                          <Tr key={index}>
                            <Td>{tablet.name}</Td>
                            <Td isNumeric>{tablet.price}</Td>
                            <Td isNumeric>{quantity}</Td>
                            <Td isNumeric>{overallPrice}</Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </TableContainer>
                <div className="flex justify-between py-4">
                  <h1 className="mx-4 font-semibold text-2xl">GRAND TOTAL</h1>
                  <h1 className="mx-4 font-semibold text-2xl">
                  ₹ {Object.values(quantities).reduce(
                      (total, quantity, index) =>
                        total + tablets[index].price * (quantity || 0),
                      0
                    )}
                  </h1>
                </div>
              </ModalBody>
            </ModalContent>
          </Modal>

          <Button className="mx-4" onClick={displayRazorpay} style={{"backgroundColor":"#a855f7", color:"white"}}>Buy Now</Button>
        </div>
      </div>
    </div>
  );
};


export default Tablets;
