import React, { useState, useEffect } from "react";

const ExplorePackages = () => {
  const [packages, setPackages] = useState([]);
  const [savedItineraries, setSavedItineraries] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'view', 'booking', 'reviews', 'feedback'
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState({});
  const [newReview, setNewReview] = useState({ rating: 5, text: "" });
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    // Load saved itineraries from localStorage
    const saved = JSON.parse(localStorage.getItem("savedItineraries") || "[]");
    setSavedItineraries(saved);

    // Load favorites from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(savedFavorites);

    // Load reviews from localStorage
    const savedReviews = JSON.parse(localStorage.getItem("packageReviews") || "{}");
    setReviews(savedReviews);

    // Mock data for packages
    const mockPackages = [
      {
        Package_ID: 1,
        Package_Name: "Goa Beach Escape",
        Destination: "Goa",
        Country: "India",
        Duration_Days: 5,
        Price_USD: 350,
        Accommodation_Type: "Resort",
        Transport_Mode: "Flight",
        Season: "Summer",
        Accessibility_Level: "Medium",
        Description: "Relaxing beach holiday with water sports and nightlife.",
        Rating: 4.3,
        Available_Slots: 15,
        Guide_Included: false,
        Start_Date: "12/5/2025",
        End_Date: "12/10/2025",
        Category: "Beach",
        Discount_Percent: 10,
        Meals_Included: true,
        Contact_Number: "-9876543119",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop",
      },
      {
        Package_ID: 2,
        Package_Name: "Golden Triangle Tour",
        Destination: "Delhi-Agra-Jaipur",
        Country: "India",
        Duration_Days: 6,
        Price_USD: 500,
        Accommodation_Type: "Hotel",
        Transport_Mode: "Bus",
        Season: "Winter",
        Accessibility_Level: "High",
        Description: "Historic circuit covering Taj Mahal and royal palaces.",
        Rating: 4.6,
        Available_Slots: 10,
        Guide_Included: true,
        Start_Date: "11/20/2025",
        End_Date: "11/26/2025",
        Category: "Cultural",
        Discount_Percent: 5,
        Meals_Included: true,
        Contact_Number: "-9123456698",
        image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop",
      },
      {
        Package_ID: 3,
        Package_Name: "Himalayan Adventure",
        Destination: "Manali",
        Country: "India",
        Duration_Days: 7,
        Price_USD: 600,
        Accommodation_Type: "Guesthouse",
        Transport_Mode: "Car",
        Season: "Winter",
        Accessibility_Level: "Low",
        Description: "Trekking and camping in the Himalayas.",
        Rating: 4.7,
        Available_Slots: 8,
        Guide_Included: true,
        Start_Date: "1/10/2026",
        End_Date: "1/17/2026",
        Category: "Adventure",
        Discount_Percent: 15,
        Meals_Included: false,
        Contact_Number: "-9988776564",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      },
      {
        Package_ID: 4,
        Package_Name: "Kerala Backwaters",
        Destination: "Alleppey",
        Country: "India",
        Duration_Days: 4,
        Price_USD: 400,
        Accommodation_Type: "Houseboat",
        Transport_Mode: "Car",
        Season: "Monsoon",
        Accessibility_Level: "High",
        Description: "Peaceful cruise through palm-lined backwaters.",
        Rating: 4.4,
        Available_Slots: 14,
        Guide_Included: false,
        Start_Date: "11/25/2025",
        End_Date: "11/29/2025",
        Category: "Nature",
        Discount_Percent: 5,
        Meals_Included: true,
        Contact_Number: "-9345678810",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop",
      },
    ];
    setPackages(mockPackages);
  }, []);

  // Toggle favorite
  const toggleFavorite = (id) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  // Add review
  const addReview = (packageId) => {
    if (!newReview.text.trim()) return;
    const packageReviews = reviews[packageId] || [];
    const updatedReviews = {
      ...reviews,
      [packageId]: [...packageReviews, { ...newReview, date: new Date().toISOString() }]
    };
    setReviews(updatedReviews);
    localStorage.setItem("packageReviews", JSON.stringify(updatedReviews));
    setNewReview({ rating: 5, text: "" });
  };

  // Submit feedback
  const submitFeedback = (packageId) => {
    if (!feedback.trim()) return;
    alert(`Thank you for your feedback on this package!`);
    setFeedback("");
    setActiveModal(null);
  };

  // Delete saved itinerary
  const deleteSavedItinerary = (id) => {
    const updated = savedItineraries.filter(item => item.id !== id);
    setSavedItineraries(updated);
    localStorage.setItem("savedItineraries", JSON.stringify(updated));
  };

  // Button styles
  const actionBtnStyle = {
    padding: "0.5rem 0.75rem",
    fontSize: "0.8rem",
    fontWeight: "500",
    borderRadius: "var(--radius-md)",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
  };

  // Modal Component
  const Modal = ({ title, onClose, children }) => (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "1rem",
    }} onClick={onClose}>
      <div style={{
        background: "var(--color-bg-secondary, #1f2937)",
        borderRadius: "var(--radius-xl)",
        padding: "2rem",
        maxWidth: "600px",
        width: "100%",
        maxHeight: "80vh",
        overflow: "auto",
        border: "1px solid var(--color-border)",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: "var(--color-text-primary)" }}>{title}</h2>
          <button onClick={onClose} style={{
            background: "transparent",
            border: "none",
            color: "var(--color-text-secondary)",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );

  // Package Card Component
  const PackageCard = ({ pkg, isSaved = false }) => {
    const pkgId = isSaved ? pkg.id : pkg.Package_ID;
    const isFavorite = favorites.includes(pkgId);
    const packageReviews = reviews[pkgId] || [];

    return (
      <div
        className="glass-panel animate-fadeIn"
        style={{
          borderRadius: "var(--radius-lg)",
          background: "var(--color-bg-glass)",
          border: isSaved ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
          overflow: "hidden",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      >
        {/* Image */}
        <div style={{
          height: "180px",
          backgroundImage: `url(${pkg.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}>
          {isSaved && (
            <div style={{
              position: "absolute",
              top: "0.75rem",
              left: "0.75rem",
              background: "var(--color-primary)",
              color: "white",
              padding: "0.25rem 0.75rem",
              borderRadius: "1rem",
              fontSize: "0.75rem",
              fontWeight: "600",
            }}>
              ✨ My Itinerary
            </div>
          )}
          <button
            onClick={() => toggleFavorite(pkgId)}
            style={{
              position: "absolute",
              top: "0.75rem",
              right: "0.75rem",
              background: "rgba(0,0,0,0.5)",
              border: "none",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              cursor: "pointer",
              fontSize: "1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.25rem", color: "var(--color-text-primary)" }}>
                {pkg.Package_Name}
              </h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem" }}>
                📍 {pkg.Destination}{pkg.Country !== "Custom" ? `, ${pkg.Country}` : ""}
              </p>
            </div>
            <div style={{
              background: "var(--color-primary)",
              color: "white",
              padding: "0.2rem 0.6rem",
              borderRadius: "1rem",
              fontSize: "0.75rem",
            }}>
              {pkg.Category}
            </div>
          </div>

          <p style={{
            color: "var(--color-text-secondary)",
            fontSize: "0.85rem",
            marginBottom: "1rem",
            lineHeight: "1.5",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {pkg.Description}
          </p>

          {/* Info Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.5rem",
            marginBottom: "1rem",
            fontSize: "0.8rem",
            color: "var(--color-text-secondary)",
          }}>
            <div>📅 {pkg.Duration_Days} days</div>
            <div>⭐ {pkg.Rating || "New"}</div>
            <div>🏨 {pkg.Accommodation_Type}</div>
            <div>♿ {pkg.Accessibility_Level}</div>
          </div>

          {/* Price */}
          {!isSaved && (
            <div style={{ marginBottom: "1rem" }}>
              <span style={{ fontSize: "1.25rem", fontWeight: "bold", color: "var(--color-primary)" }}>
                ${pkg.Price_USD}
              </span>
              {pkg.Discount_Percent > 0 && (
                <span style={{
                  marginLeft: "0.5rem",
                  textDecoration: "line-through",
                  color: "var(--color-text-secondary)",
                  fontSize: "0.85rem",
                }}>
                  ${(pkg.Price_USD * (1 + pkg.Discount_Percent / 100)).toFixed(0)}
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <button
              onClick={() => { setSelectedPackage(pkg); setActiveModal("view"); }}
              style={{
                ...actionBtnStyle,
                background: "var(--gradient-primary)",
                border: "none",
                color: "white",
              }}
            >
              👁️ View
            </button>
            <button
              onClick={() => { setSelectedPackage(pkg); setActiveModal("booking"); }}
              style={{
                ...actionBtnStyle,
                background: "rgba(16, 185, 129, 0.2)",
                border: "1px solid rgba(16, 185, 129, 0.5)",
                color: "#34d399",
              }}
            >
              🎫 Book
            </button>
            <button
              onClick={() => { setSelectedPackage(pkg); setActiveModal("reviews"); }}
              style={{
                ...actionBtnStyle,
                background: "rgba(251, 191, 36, 0.2)",
                border: "1px solid rgba(251, 191, 36, 0.5)",
                color: "#fbbf24",
              }}
            >
              ⭐ Reviews ({packageReviews.length})
            </button>
            <button
              onClick={() => { setSelectedPackage(pkg); setActiveModal("feedback"); }}
              style={{
                ...actionBtnStyle,
                background: "rgba(99, 102, 241, 0.2)",
                border: "1px solid rgba(99, 102, 241, 0.5)",
                color: "#818cf8",
              }}
            >
              💬 Feedback
            </button>
            {isSaved && (
              <button
                onClick={() => deleteSavedItinerary(pkg.id)}
                style={{
                  ...actionBtnStyle,
                  background: "rgba(239, 68, 68, 0.2)",
                  border: "1px solid rgba(239, 68, 68, 0.5)",
                  color: "#f87171",
                }}
              >
                🗑️ Delete
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page" style={{ paddingTop: "80px" }}>
      <div className="container">
        <h1
          className="hero-title animate-fadeIn"
          style={{ fontSize: "2.5rem", marginBottom: "1rem" }}
        >
          🌍 Explore Travel Packages
        </h1>
        <p
          className="hero-subtitle animate-fadeIn"
          style={{ animationDelay: "0.1s", marginBottom: "2rem" }}
        >
          Discover amazing destinations with our curated travel packages
          designed for accessibility and adventure.
        </p>

        {/* Saved Itineraries Section */}
        {savedItineraries.length > 0 && (
          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "1.5rem",
              color: "var(--color-text-primary)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}>
              <span>✨</span> My Saved Itineraries
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.5rem",
            }}>
              {savedItineraries.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} isSaved={true} />
              ))}
            </div>
          </div>
        )}

        {/* Featured Packages */}
        <h2 style={{
          fontSize: "1.5rem",
          fontWeight: "700",
          marginBottom: "1.5rem",
          color: "var(--color-text-primary)",
        }}>
          🎯 Featured Packages
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}>
          {packages.map((pkg) => (
            <PackageCard key={pkg.Package_ID} pkg={pkg} />
          ))}
        </div>
      </div>

      {/* View Modal */}
      {activeModal === "view" && selectedPackage && (
        <Modal title={`${selectedPackage.Package_Name}`} onClose={() => setActiveModal(null)}>
          {selectedPackage.itinerary ? (
            <div>
              <p style={{ marginBottom: "1rem", color: "var(--color-text-secondary)" }}>
                {selectedPackage.Description}
              </p>
              {selectedPackage.accessibilityNotes && (
                <div style={{
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "1rem",
                  marginBottom: "1rem",
                }}>
                  <strong style={{ color: "#34d399" }}>♿ Accessibility Notes:</strong>
                  <p style={{ color: "var(--color-text-primary)", marginTop: "0.5rem" }}>
                    {selectedPackage.accessibilityNotes}
                  </p>
                </div>
              )}
              {selectedPackage.itinerary.days?.map((day, idx) => (
                <div key={idx} style={{ marginBottom: "1rem" }}>
                  <h4 style={{ color: "var(--color-primary)", marginBottom: "0.5rem" }}>
                    Day {day.day}: {day.title}
                  </h4>
                  {day.activities?.map((act, actIdx) => (
                    <div key={actIdx} style={{
                      display: "flex",
                      gap: "1rem",
                      padding: "0.5rem 0",
                      borderBottom: "1px solid var(--color-border)",
                    }}>
                      <span style={{ color: "#818cf8", fontWeight: "600", minWidth: "70px" }}>{act.time}</span>
                      <div>
                        <p style={{ color: "var(--color-text-primary)" }}>{act.activity}</p>
                        {act.accessibility && (
                          <span style={{ color: "#34d399", fontSize: "0.8rem" }}>♿ {act.accessibility}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div>
              <p style={{ color: "var(--color-text-secondary)", marginBottom: "1rem" }}>
                {selectedPackage.Description}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>📅 Duration: {selectedPackage.Duration_Days} days</div>
                <div>💰 Price: ${selectedPackage.Price_USD}</div>
                <div>🏨 Stay: {selectedPackage.Accommodation_Type}</div>
                <div>✈️ Transport: {selectedPackage.Transport_Mode}</div>
                <div>🍽️ Meals: {selectedPackage.Meals_Included ? "Included" : "Not included"}</div>
                <div>👤 Guide: {selectedPackage.Guide_Included ? "Included" : "Not included"}</div>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Booking Modal */}
      {activeModal === "booking" && selectedPackage && (
        <Modal title="Book This Package" onClose={() => setActiveModal(null)}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎫</div>
            <h3 style={{ color: "var(--color-text-primary)", marginBottom: "0.5rem" }}>
              {selectedPackage.Package_Name}
            </h3>
            <p style={{ color: "var(--color-primary)", fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
              ${selectedPackage.Price_USD || "Free"}
            </p>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "2rem" }}>
              {selectedPackage.Available_Slots || "1"} slot(s) available
            </p>
            <button
              onClick={() => {
                alert("Booking confirmed! Check your email for details.");
                setActiveModal(null);
              }}
              style={{
                background: "var(--gradient-primary)",
                border: "none",
                padding: "1rem 2rem",
                borderRadius: "var(--radius-lg)",
                color: "white",
                fontWeight: "600",
                fontSize: "1rem",
                cursor: "pointer",
                width: "100%",
              }}
            >
              ✅ Confirm Booking
            </button>
          </div>
        </Modal>
      )}

      {/* Reviews Modal */}
      {activeModal === "reviews" && selectedPackage && (
        <Modal title="Reviews" onClose={() => setActiveModal(null)}>
          <div>
            {/* Existing Reviews */}
            {(reviews[selectedPackage.isUserGenerated ? selectedPackage.id : selectedPackage.Package_ID] || []).length > 0 ? (
              <div style={{ marginBottom: "1.5rem" }}>
                {(reviews[selectedPackage.isUserGenerated ? selectedPackage.id : selectedPackage.Package_ID] || []).map((review, idx) => (
                  <div key={idx} style={{
                    padding: "1rem",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "var(--radius-md)",
                    marginBottom: "0.75rem",
                  }}>
                    <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.5rem" }}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ color: i < review.rating ? "#fbbf24" : "#4b5563" }}>★</span>
                      ))}
                    </div>
                    <p style={{ color: "var(--color-text-primary)" }}>{review.text}</p>
                    <p style={{ color: "var(--color-text-tertiary)", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--color-text-secondary)", marginBottom: "1.5rem" }}>
                No reviews yet. Be the first to review!
              </p>
            )}

            {/* Add Review */}
            <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1.5rem" }}>
              <h4 style={{ color: "var(--color-text-primary)", marginBottom: "1rem" }}>Add Your Review</h4>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ color: "var(--color-text-secondary)", display: "block", marginBottom: "0.5rem" }}>Rating</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                        color: star <= newReview.rating ? "#fbbf24" : "#4b5563",
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                placeholder="Write your review..."
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "var(--radius-md)",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-primary)",
                  minHeight: "100px",
                  resize: "vertical",
                  marginBottom: "1rem",
                }}
              />
              <button
                onClick={() => addReview(selectedPackage.isUserGenerated ? selectedPackage.id : selectedPackage.Package_ID)}
                style={{
                  background: "var(--gradient-primary)",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "var(--radius-md)",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Submit Review
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Feedback Modal */}
      {activeModal === "feedback" && selectedPackage && (
        <Modal title="Share Feedback" onClose={() => setActiveModal(null)}>
          <div>
            <p style={{ color: "var(--color-text-secondary)", marginBottom: "1rem" }}>
              Help us improve by sharing your thoughts about this package.
            </p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Your feedback helps us serve you better..."
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "var(--radius-md)",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
                minHeight: "150px",
                resize: "vertical",
                marginBottom: "1rem",
              }}
            />
            <button
              onClick={() => submitFeedback(selectedPackage.isUserGenerated ? selectedPackage.id : selectedPackage.Package_ID)}
              style={{
                background: "var(--gradient-primary)",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "var(--radius-md)",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
                width: "100%",
              }}
            >
              💬 Submit Feedback
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ExplorePackages;
