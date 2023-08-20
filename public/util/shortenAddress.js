const shortenAddress = (address, frontNum = 5, backNum = 10) => {
  if (!address) return;
  return `${address.slice(0, frontNum)}...${address.slice(
    address.length - backNum
  )}`;
};

export default shortenAddress;
