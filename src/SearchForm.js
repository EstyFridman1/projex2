import React, { useState } from 'react';
import AddressAutocomplete from './AddressAutocomplete';
import Map from './Map';

const SearchForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        address: '',
        phone: '',
        email: '',
        internetConnection: false,
        kitchen: false,
        coffeeMachine: false,
        rooms: '',
        distance: '',
        status: 'מחפש' // הסטטוס יאותחל אוטומטית ל"מחפש"
    });
    //משתנה בסטייט שמכיל לי בכל שינוי את הכתובת המוקלדת
    const [addressSuggestions, setAddressSuggestions] = useState([]);
    //הוספת סטייט ל: לקואורדינטות
    const [addressCoordinates, setAddressCoordinates] = useState(null); // הוספת state לקואורדינטות
    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        if (formData) {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value
            });
        } else {
            console.error("formData is undefined");
        }
    };
    // כאן אנו מעדכנים את מצב הטופס (formData) באמצעות הפונקציה setFormData.

    // type === 'checkbox' ? checked : value: אם השדה הוא תיבת סימון, אנו מעדכנים את הערך לפי האם היא מסומנת או לא (checked), אחרת אנו משתמשים בערך הקלט (value).
    const handleSubmit = (e) => {
        e.preventDefault();
        //בהמשך כאן להוסיף לוגיקה לשליחת הנתונים
        console.log(formData);
    };
    const handleAddressSelect = (suggestion) => {
        setFormData({ ...formData, address: suggestion.display_name });
        setAddressCoordinates({ lat: suggestion.lat, lng: suggestion.lon }); // שמירת הקואורדינטות
        setAddressSuggestions([]);
    };
    return (
        <>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>שם משתמש:</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>
                <div>
                    <label>כתובת לחיפוש:</label>
                    {/* AddressAutocomplete: הקומפוננטה שולחת בקשה ל-Nominatim API בכל פעם שהכתובת משתנה. */}

                    <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                    <AddressAutocomplete
                        address={formData.address}
                        setAddressSuggestions={setAddressSuggestions}
                        setFormData={setFormData}
                        addressSuggestions={addressSuggestions}
                        handleAddressSelect={handleAddressSelect} // העברת הפונקציה לבחירת כתובת
                    />
                </div>
                {/* הצגת תוצאות ההצעות */}
                {addressSuggestions.length > 0 && (
                    <ul>
                        {addressSuggestions.map((suggestion) => (
                            <li key={suggestion.place_id} onClick={() => setFormData({ ...formData, address: suggestion.display_name })}>
                                {suggestion.display_name}
                            </li>
                        ))}
                    </ul>
                )}
                <Map addressCoordinates={addressCoordinates} 
                address={formData.address}///הוא לא באמת מציג את הכתובת על המפה לבדוק!!!!
                /> {/* העברת הקואורדינטות לרכיב המפה */}
                <div>
                    <label>טלפון:</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div>
                    <label>כתובת מייל:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>האם נדרש חיבור לאינטרנט:</label>
                    <input type="checkbox" name="internetConnection" checked={formData.internetConnection} onChange={handleChange} />
                </div>
                <div>
                    <label>האם נדרש מטבח:</label>
                    <input type="checkbox" name="kitchen" checked={formData.kitchen} onChange={handleChange} />
                </div>
                <div>
                    <label>האם נדרשת מכונת קפה:</label>
                    <input type="checkbox" name="coffeeMachine" checked={formData.coffeeMachine} onChange={handleChange} />
                </div>
                <div>
                    <label>מספר חדרים:</label>
                    <input type="number" name="rooms" value={formData.rooms} onChange={handleChange} required />
                </div>
                <div>
                    <label>מרחק שהוא מוכן לזוז מהכתובת שהוזנה:</label>
                    <input type="number" name="distance" value={formData.distance} onChange={handleChange} required />
                </div>
                <div>
                    <input type="hidden" name="status" value={formData.status} />
                </div>
                <button type="submit">שלח</button>
            </form>
        </>
    );
};

export default SearchForm;
