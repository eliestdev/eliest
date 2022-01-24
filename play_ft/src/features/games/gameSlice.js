import { createSlice } from '@reduxjs/toolkit'
import { states } from 'naija-state-local-government'

export const gamesSlice = createSlice({
    name: 'games',
    initialState: {
        loading: false,
        list: [],
        selected: null,
        guess: [0, 0],
        gameModal: false,
        errors: [],
        response: "",
        scratchModal: false,
        transferModal: false,
    },
    reducers: {
        setGames: (state, data) => {
            state.list = data.payload
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
        },showScratchModal: (state, action) => {
            state.scratchModal = action.payload
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
        setTransferModal: (state, data) => {
            state.transferModal = data.payload
        },
    },
})

export const { setGames, setSelected, setLoading, setGuess, toggleGameModal, addError, clearErrors,setResponse,discardGuess, showScratchModal, setTransferModal } = gamesSlice.actions

export default gamesSlice.reducer