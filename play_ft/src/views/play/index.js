import BottomSVG from "components/bottomsvg";
import ErrorUI from "components/error";
import PlayHeader from "components/header/Play";
import React, { useEffect, useState } from "react";
import Overlay from "./overlay";
import LeftPlay from "components/left-play";
import AllGames from "components/all-games";
import Vouchers from "components/vouchers";
import { useDispatch, useSelector } from "react-redux";
import { setGames } from "features/games/gameSlice";
import { addError } from "features/games/gameSlice";
import SCard from "components/scratch card";
import { showScratchModal } from "features/games/gameSlice";

const Index = () => {
  const dispatch = useDispatch()
  const selected = useSelector((state) => state.games.selected) || {}
  const gameModal = useSelector((state) => state.games.gameModal)
  const errors = useSelector((state) => state.games.errors)
  const scratchCard = useSelector((state) => state.games.scratchModal);

  const getGames = async () => {
    try {
      const result = await fetch(`${process.env.REACT_APP_USSD_URL}v1/games/list`)
      const data = await result.json()
      dispatch(setGames(data))
    } catch (e) {
      dispatch(addError("Could not find any game at this moment"))
    }
  }

  useEffect(() => getGames(), [])

  return (
    <div className="">
      <PlayHeader />
      <div className="py-8">
        <div className="flex flex-wrap sm:flex-no-wrap md:container m-auto">
          <LeftPlay />
          <AllGames />
          <Vouchers />
        </div>
        <Overlay open={gameModal} game={selected} />
        <SCard open={scratchCard} setOpen={() => {dispatch(showScratchModal(!scratchCard))}}/>

        {/* Error UI */}
        {errors.length > 0 ? <ErrorUI errors={errors} /> : null}
      </div>
      <BottomSVG />
    </div>
  );
};

Index.propTypes = {};

export default Index;
