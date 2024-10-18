"use client"; // Client Component for stateful logic

import { useState, useEffect } from "react";
import { skuList } from "../../data/skus"; // Mocked SKUs for the table

export default function BuyingPage() {
  const [accountId] = useState("John Doe"); // Placeholder Account Name
  const [stockPoint, setStockPoint] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [category, setCategory] = useState(""); // Example category dropdown
  const [skus, setSkus] = useState([
    {
      skuId: "IRC001",
      skuBrand: "Indomie",
      skuName: "Indomie regular Chicken",
      price: 5850,
      recommendedQty: 200,
      qtyToBuy: "",
      note: "",
    },
    {
      skuId: "Dan008",
      skuBrand: "Dano",
      skuName: "Dano UHT 3009",
      price: 5678,
      recommendedQty: 120,
      qtyToBuy: "",
      note: "",
    },
  ]); // SKUs in the table
  const [newSku, setNewSku] = useState(""); // For new SKU selection
  const [debouncedQty, setDebouncedQty] = useState({});
  const [skuSearch, setSkuSearch] = useState(""); // SKU Search state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Control dropdown visibility
  const [selectedPrice, setSelectedPrice] = useState(null); // Store the selected price
  const [selectedRecommendedQty, setSelectedRecommendedQty] = useState(0); // Store recommended quantity
  const [selectedQtyToBuy, setSelectedQtyToBuy] = useState(""); // Store qtyToBuy
  const limit = 5000000; // Placeholder limit for total cost

  // Debounce logic for qtyToBuy input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSkus((prevSkus) =>
        prevSkus.map((sku, index) =>
          debouncedQty[index] !== undefined
            ? { ...sku, qtyToBuy: debouncedQty[index] }
            : sku
        )
      );
    }, 300); // 300ms delay

    return () => {
      clearTimeout(handler); // Clear timeout if input changes within the delay
    };
  }, [debouncedQty]);

  // Function to handle adding a new SKU with its recommended quantity and price
const handleAddSku = () => {
  const selectedSku = skuList.find((sku) => sku.skuId === newSku);
  if (selectedSku) {
    setSkus([
      ...skus,
      {
        ...selectedSku,
        recommendedQty: 0, // Set recommended quantity to 0
        qtyToBuy: "", // Leave qtyToBuy empty for user input
        note: "",
      },
    ]);
    setNewSku(""); // Reset new SKU selection
    setSkuSearch(""); // Reset search input
    setSelectedPrice(null); // Reset price
    setSelectedRecommendedQty(0); // Reset recommended quantity
    setSelectedQtyToBuy(""); // Reset qty to buy
  }
};

  // Handle debounced qtyToBuy change
  const handleQtyChangeDebounced = (index, value) => {
    setDebouncedQty((prevQty) => ({
      ...prevQty,
      [index]: value === "" ? "" : parseInt(value),
    }));
  };

  // Handle note change
  const handleNoteChange = (index, value) => {
    const updatedSkus = [...skus];
    updatedSkus[index].note = value;
    if (value !== "Others") {
      updatedSkus[index].customNote = "";
    }
    setSkus(updatedSkus);
  };

  // Handle custom note change
  const handleOtherNoteChange = (index, value) => {
    const updatedSkus = [...skus];
    updatedSkus[index].customNote = value;
    setSkus(updatedSkus);
  };

  // Delete functionality
  const handleDeleteSku = (index) => {
    const updatedSkus = skus.filter((_, skuIndex) => skuIndex !== index);
    setSkus(updatedSkus);
  };

  // Handle SKU selection
  const handleSelectSku = (skuId) => {
    const selectedSku = skuList.find((sku) => sku.skuId === skuId);
    setNewSku(skuId); // Set the new selected SKU ID
    setSkuSearch(selectedSku.skuName); // Set the search input to the selected SKU's name
    setSelectedPrice(selectedSku.price); // Set the price of the selected SKU
    setSelectedRecommendedQty(0); // Set recommended quantity to 0
    setSelectedQtyToBuy(""); // Leave qtyToBuy empty for user input
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  // Filter SKUs based on search
  const filteredSkus = skuList.filter((sku) =>
    sku.skuName.toLowerCase().includes(skuSearch.toLowerCase())
  );

  const total = skus.reduce(
    (acc, sku) => acc + (sku.qtyToBuy ? sku.qtyToBuy * sku.price : 0),
    0
  );
  const isOverLimit = total > limit;

  return (
    <div className="max-w-full mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Buying Page</h2>

      {/* Top Filters Section */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="font-semibold">Account Username: </label>
          <span>{accountId}</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {/* Category Dropdown */}
          <div>
            <label className="block font-semibold">Category: </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="Food">Food</option>
              <option value="Beverage">Beverage</option>
            </select>
          </div>

          {/* Stock Point Dropdown */}
          <div>
            <label className="block font-semibold">Stock Point: </label>
            <select
              value={stockPoint}
              onChange={(e) => setStockPoint(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="" disabled>
                Select Stock Point
              </option>
              <option value="Point1">Point 1</option>
              <option value="Point2">Point 2</option>
            </select>
          </div>

          {/* Manufacturer Dropdown */}
          <div>
            <label className="block font-semibold">Manufacturer: </label>
            <select
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="" disabled>
                Select Manufacturer
              </option>
              <option value="Manufacturer1">Manufacturer 1</option>
              <option value="Manufacturer2">Manufacturer 2</option>
            </select>
          </div>
        </div>
      </div>

      {/* Prominent LIMIT Indicator */}
      <div className="text-red-600 text-xl font-bold mb-4">LIMIT: {limit}</div>

      {/* SKU Table */}

      <div className="overflow-x-auto min-h-[450px] overflow-y-auto">
        <table className="table-auto w-full text-center border-collapse border border-gray-300 mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-4 w-1/12">Action</th>
              <th className="border border-gray-300 p-4 w-2/12">Brand Name</th>
              <th className="border border-gray-300 p-4 w-3/12">Sku Name</th>
              <th className="border border-gray-300 p-4 w-1/12">Price</th>
              <th className="border border-gray-300 p-4 w-2/12">
                Recommended Qty
              </th>
              <th className="border border-gray-300 p-4 w-2/12">Qty to Buy</th>
              <th className="border border-gray-300 p-4 w-2/12">Value</th>
              <th className="border border-gray-300 p-4 w-2/12">Note</th>
            </tr>
          </thead>
          <tbody>
            {skus.map((sku, index) => (
              <tr key={sku.skuId}>
                <td className="border border-gray-300 p-2">
                  <button
                    className="text-red-500 font-bold text-lg px-2"
                    onClick={() => handleDeleteSku(index)}
                  >
                    -
                  </button>
                </td>
                <td className="border border-gray-300 p-2">{sku.skuBrand}</td>
                <td className="border border-gray-300 p-2">{sku.skuName}</td>
                <td className="border border-gray-300 p-2">{sku.price}</td>
                <td className="border border-gray-300 p-2">
                  {sku.recommendedQty}
                </td>
                <td className="border border-gray-300 p-2">
                  {/* Only show the input field for qtyToBuy after SKU is added */}
                  {newSku ? (
                    ""
                  ) : (
                    <input
                      type="number"
                      value={debouncedQty[index] || sku.qtyToBuy}
                      onChange={(e) =>
                        handleQtyChangeDebounced(index, e.target.value)
                      }
                      className="border border-gray-300 rounded-lg p-2 w-20"
                      placeholder={sku.recommendedQty}
                    />
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {sku.qtyToBuy * sku.price}
                </td>
                <td className="border border-gray-300 p-2">
                  {sku.qtyToBuy !== sku.recommendedQty &&
                    sku.qtyToBuy !== "" && (
                      <div>
                        <select
                          value={sku.note}
                          onChange={(e) =>
                            handleNoteChange(index, e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-lg p-2"
                        >
                          <option value="" disabled>
                            Select Reason
                          </option>
                          <option value="Insufficient quantity from manufacturer">
                            Insufficient quantity from manufacturer
                          </option>
                          <option value="Price issue">Price issue</option>
                          <option value="Others">Others</option>
                        </select>
                        {sku.note === "Others" && (
                          <input
                            type="text"
                            value={sku.customNote}
                            onChange={(e) =>
                              handleOtherNoteChange(index, e.target.value)
                            }
                            className="border border-gray-300 rounded-lg p-2 w-full mt-2"
                            placeholder="Enter custom reason"
                          />
                        )}
                      </div>
                    )}
                </td>
              </tr>
            ))}
            {/* Row to Add New SKU */}
            <tr>
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2">
                {newSku
                  ? skuList.find((sku) => sku.skuId === newSku)?.skuBrand
                  : ""}
              </td>
              <td className="border border-gray-300 p-2">
                {!newSku ? (
                  <div className="relative">
                    {/* Show the search input until an SKU is selected */}
                    <input
                      type="text"
                      placeholder="Search SKU"
                      value={skuSearch}
                      onFocus={() => setIsDropdownOpen(true)} // Open dropdown on focus
                      onChange={(e) => setSkuSearch(e.target.value)} // Update search input
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    {isDropdownOpen && (
                      <div className="absolute z-10 bg-white border border-gray-300 mt-1 rounded-lg shadow-lg w-full max-h-40 overflow-y-auto">
                        {filteredSkus.map((sku) => (
                          <div
                            key={sku.skuId}
                            className="p-2 cursor-pointer hover:bg-gray-200"
                            onClick={() => handleSelectSku(sku.skuId)} // Set SKU on click
                          >
                            {sku.skuName}
                          </div>
                        ))}
                        {filteredSkus.length === 0 && (
                          <div className="p-2 text-gray-500">No SKUs found</div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <span>{skuSearch}</span> // Display the selected SKU name as plain text
                )}
              </td>
              <td className="border border-gray-300 p-2">
                {newSku ? selectedPrice : ""}
              </td>{" "}
              {/* Display the price */}
              <td className="border border-gray-300 p-2">
                {newSku ? selectedRecommendedQty : ""}
              </td>{" "}
              {/* Display recommended quantity */}
              <td className="border border-gray-300 p-2">
                {/* Only show qty to buy input after SKU is added */}
                {newSku ? (
                  <input
                    type="number"
                    value={selectedQtyToBuy}
                    onChange={(e) => setSelectedQtyToBuy(e.target.value)} // User can fill in qtyToBuy
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="Enter qty to buy"
                  />
                ) : (
                  ""
                )}
              </td>
              <td className="border border-gray-300 p-2"></td>
              <td className="border border-gray-300 p-2">
                <button
                  className={`mt-2 text-white rounded-lg px-4 py-2 ${
                    newSku ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400"
                  }`}
                  onClick={handleAddSku}
                  disabled={!newSku}
                >
                  + Add SKU
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Total and Warning */}
      <div className="flex justify-end items-center space-x-4">
        <strong className="text-lg">Total: {total}</strong>
        {isOverLimit && (
          <p className="text-red-500 font-bold">
            Warning: Total exceeds the limit!
          </p>
        )}
      </div>

      {/* Save and Close Buttons */}
      <div className="flex justify-end mt-4 space-x-4">
        <button
          disabled={isOverLimit}
          className={`px-4 py-2 rounded-lg ${
            isOverLimit
              ? "bg-gray-400"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          Save
        </button>
        <button className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">
          Close
        </button>
      </div>
    </div>
  );
}
