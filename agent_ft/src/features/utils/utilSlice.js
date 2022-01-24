import { createSlice } from '@reduxjs/toolkit';

export const utilSlice = createSlice({
  name: 'utility',
  initialState: {
    mobileBar: false,
    getVoucher: false,
    seeTarget: false,
    playModal: false,
    winningCodeModal: false,
    scratchModal: false,
  },
  reducers: {
    showSideBar: (state, action) => {
      state.mobileBar = action.payload
    },
    showGetVoucher: (state, action) => {
      state.getVoucher = action.payload
    },
    showSeeTargets: (state, action) => {
      state.seeTarget = action.payload
    },
    showPlayModal: (state, action) => {
      state.playModal = action.payload
    },
    showScratchModal: (state, action) => {
      state.playModal = action.payload
    },
    showWinningModal: (state, action) => {
      state.winningCodeModal = action.payload
    },
    showScratchModal: (state, action) => {
      state.scratchModal = action.payload
    },
  },
});

export const { showSideBar, showGetVoucher, showPlayModal, showSeeTargets, showWinningModal, showScratchModal,  } = utilSlice.actions;

export default utilSlice.reducer;