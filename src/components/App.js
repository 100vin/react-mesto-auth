import { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm ';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';
import api from '../utils/api';
import avatarDefault from '../images/avatar.jpg';

function App() {
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState({
    name: 'Жак-Ив Кусто',
    about: 'Исследователь океана',
    avatar: avatarDefault,
  });
  const [cards, setCards] = useState([]);

  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isTooltipPopupOpen, setTooltipPopupOpen] = useState(true);
  const [tooltipData, setTooltipData] = useState({
    type: 'success',
    message: 'Успешно!'
  });
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getUserInfo(), 
      api.getInitialCards()
    ])
    .then(([userData, initialCards]) => {
      setCurrentUser(userData);
      setCards(initialCards);
    })
    .catch(err => console.log(err));
  }, []);

  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setTooltipPopupOpen(false);
    setSelectedCard(null);
  }

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }
  
  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }
  
  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  }
  
  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleUpdateUser(userData) {
    api.changeUserInfo(userData)
      .then(newUserData => setCurrentUser(newUserData))
      .catch(err => console.log(err))
      .finally(() => closeAllPopups());
  }
  
  function handleUpdateAvatar(userData) {
    api.changeAvatar(userData)
      .then(newUserData => setCurrentUser(newUserData))
      .catch(err => console.log(err))
      .finally(() => closeAllPopups());
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.toggleLike(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(err => console.log(err));
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch(err => console.log(err));
  }

  function handleAddPlaceSubmit(card) {
    api.addCard(card)
      .then(newCard => setCards([newCard, ...cards]))
      .catch(err => console.log(err))
      .finally(() => closeAllPopups());
  }

  function handleRegister() {

  }
  
  function handleLogin() {

  }


  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header
        isLoggedIn={isLoggedIn}
      />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Main
                cards={cards}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/sign-up"
          element={<Register onRegister={handleRegister} />}
        />

        <Route
          path="/sign-in"
          element={<Login onLogin={handleLogin} />}
        />

        <Route
          path="*"
          element={isLoggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" />}
        />
      </Routes>

      {location.pathname.includes('sign') ? '' : <Footer/>}
      
      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
      />

      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
      />

      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddPlaceSubmit}
      />

      <ImagePopup
        card={selectedCard}
        onClose={closeAllPopups}
      />

      <InfoTooltip
        isOpen={isTooltipPopupOpen}
        onClose={closeAllPopups}
        type={tooltipData.type}
        message={tooltipData.message}
      />

      <PopupWithForm
        name="Confirm"
        title="Вы уверены?"
        buttonText="Да"
        onClose={closeAllPopups}
      />
    </CurrentUserContext.Provider>
  );
}

export default App;