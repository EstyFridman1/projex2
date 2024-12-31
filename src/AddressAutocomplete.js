import axios from "axios"
import { useEffect } from "react";
const AddressAutocomplete = ({ address, setAddressSuggestions,addressSuggestions,setFormData,handleAddressSelect  }) => {

    useEffect(() => {
        const fetchAddressSuggestions = async () => {
            if (address) {
                try {
                    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`);
                    setAddressSuggestions(response.data);
                }

                catch {
                    console.error("Error fetching address suggestions:");
                }
            }
        }
        fetchAddressSuggestions();
    }, [address]);

    const handleSuggestionClick = (suggestion) => {
        setFormData((prevData) => ({
            ...prevData,
            address: suggestion.display_name // עדכון הכתובת לכתובת שנבחרה
        }));
        handleAddressSelect(suggestion);
        setAddressSuggestions([]); // ננקה את ההצעות לאחר הבחירה
    };
    
    return (
        <>
            {address && (
                <ul>
                    {addressSuggestions .map((suggestion) => (
                        <li key={suggestion.place_id} onClick={() => handleSuggestionClick(suggestion)}>
                            {suggestion.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </>
    )

}


export default AddressAutocomplete