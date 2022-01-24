import { createSlice } from '@reduxjs/toolkit';

export const playSlice = createSlice({
  name: 'play',
  initialState: {
    loading: false,
    games: [],
    selected: null,
    guess: [0, 0],
    errors: [],
    response: ""
  },
  reducers: {
    setGames: (state, data) => {
        state.games = data.payload
    },
    setSelected: (state, data) => {
        state.selected = data.payload
    },
    setLoading: (state, flag) => {
        state.loading = flag.payload
    },
    setGuess: (state, { payload }) => {
        let copy = [...state.guess]
        state.guess = [copy[1], payload]
    },
    toggleGameModal: (state) => {
        state.gameModal = !state.gameModal
    },
    addError: (state, data) => {
        state.errors = [...state.errors, data.payload]
    },
    clearErrors: (state, data) => {
        state.errors = []
    },
    setResponse: (state, {payload}) => {
        state.response = payload
    }, discardGuess: (state) => {
        state.guess =   [0,0]
    },
  },
});


export const {  setGames, setSelected, setLoading, setGuess, toggleGameModal, addError, clearErrors,setResponse,discardGuess} = playSlice.actions;

export default playSlice.reducer;