const categories = [
    { id: 'all', name: 'All' },
    { id: 'veg', name: 'Veg' },
    { id: 'non-veg', name: 'Non-Veg' },
    { id: 'pizza', name: 'Pizza' },
    { id: 'chinese', name: 'Chinese' },
    { id: 'dessert', name: 'Dessert' },
    { id: 'beverages', name: 'Drinks' }
];

const menuItems = [
    {
        id: 1,
        name: "Margherita Pizza",
        price: "299",
        category: "pizza",
        type: "veg",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80",
        description: "Classic delight with 100% real mozzarella cheese."
    },
    {
        id: 2,
        name: "Chicken Pepperoni",
        price: "399",
        category: "pizza",
        type: "non-veg",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=500&q=80",
        description: "American classic! Spicy herbed chicken pepperoni."
    },
    {
        id: 3,
        name: "Veg Hakka Noodles",
        price: "249",
        category: "chinese",
        type: "veg",
        image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=500&q=80",
        description: "Stir-fried noodles with fresh vegetables and soy sauce."
    },
    {
        id: 4,
        name: "Kung Pao Chicken",
        price: "349",
        category: "chinese",
        type: "non-veg",
        image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=500&q=80",
        description: "Spicy stir-fry chicken with peanuts, vegetables, and chili peppers."
    },
    {
        id: 5,
        name: "Paneer Tikka",
        price: "289",
        category: "veg",
        type: "veg",
        image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80",
        description: "Cottage cheese cubes marinated in spices and grilled in tandoor."
    },
    {
        id: 6,
        name: "Grilled Chicken Salad",
        price: "329",
        category: "non-veg",
        type: "non-veg",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80",
        description: "Fresh greens topped with grilled chicken breast and vinaigrette."
    },
    {
        id: 7,
        name: "Schezwan Fried Rice",
        price: "269",
        category: "chinese",
        type: "veg",
        image: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=500&q=80",
        description: "Spicy fried rice tossed with schezwan sauce and vegetables."
    },
    {
        id: 8,
        name: "Chocolate Lava Cake",
        price: "199",
        category: "dessert",
        type: "veg",
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=500&q=80",
        description: "Molten chocolate cake served warm."
    },
    {
        id: 9,
        name: "Mojito",
        price: "149",
        category: "beverages",
        type: "veg",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80",
        description: "Refreshing mint and lime cocktail."
    },
    {
        id: 10,
        name: "Coca-Cola",
        price: "59",
        category: "beverages",
        type: "veg",
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80",
        description: "Ice cold cola served with lemon slice."
    }
];
