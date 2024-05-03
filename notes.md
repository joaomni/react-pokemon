const capturedPokemon = await prisma.captured.findUnique({
  where: { id: "e95e0b48-a017-4e67-b07b-eb88a851c889" },
});

console.log("First attack:", capturedPokemon.attacks?.first);