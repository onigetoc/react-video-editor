"use client";
import React, { useEffect, useRef, useState } from "react";
import Timeline from "./timeline";
import useStore from "./store/use-store";
import Navbar from "./navbar";
import useTimelineEvents from "./hooks/use-timeline-events";
import Scene from "./scene";
import StateManager, { LAYER_DELETE, HISTORY_UNDO, HISTORY_REDO } from "@designcombo/state";
import { PLAYER_PAUSE, PLAYER_PLAY } from "./constants/events";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ImperativePanelHandle } from "react-resizable-panels";
import { getCompactFontData, loadFonts } from "./utils/fonts";
import { SECONDARY_FONT, SECONDARY_FONT_URL } from "./constants/constants";
import MenuList from "./menu-list";
import { MenuItem } from "./menu-item";
import { ControlItem } from "./control-item";
import CropModal from "./crop-modal/crop-modal";
import useDataState from "./store/use-data-state";
import { FONTS } from "./data/fonts";
import FloatingControl from "./control-item/floating-controls/floating-control";
import { dispatch } from "@designcombo/events";
import useImportedMediaStore from "./store/use-imported-media-store";

const stateManager = new StateManager({
  size: {
    width: 1920,
    height: 1080,
  },
});

const Editor: React.FC = () => {
  const [projectName, setProjectName] = useState<string>("Untitled video");
  const timelinePanelRef = useRef<ImperativePanelHandle>(null);
  const { timeline, playerRef, activeIds, setState } = useStore();
  const [isPlaying, setIsPlaying] = useState(false);

  useTimelineEvents();

  const { setCompactFonts, setFonts } = useDataState();
  const { initializeStore: initializeImportedMediaStore } = useImportedMediaStore();

  // Déclencher le centrage automatique au démarrage
  useEffect(() => {
    // S'assurer que le StateManager et le store sont synchronisés au démarrage
    const currentSize = { width: 1920, height: 1080 };
    
    // Mettre à jour le StateManager
    stateManager.updateState({ size: currentSize });
    
    // Mettre à jour le store Zustand pour déclencher le centrage
    setState({ size: currentSize });
  }, [setState]); // Ajouter setState comme dépendance
  useEffect(() => {
    setCompactFonts(getCompactFontData(FONTS));
    setFonts(FONTS);
  }, [setCompactFonts, setFonts]);

  // Initialiser le store des médias importés au démarrage de l'éditeur
  useEffect(() => {
    initializeImportedMediaStore();
  }, [initializeImportedMediaStore]);

  useEffect(() => {
    loadFonts([
      {
        name: SECONDARY_FONT,
        url: SECONDARY_FONT_URL,
      },
    ]);
  }, []);

  useEffect(() => {
    const screenHeight = window.innerHeight;
    const desiredHeight = 300;
    const percentage = (desiredHeight / screenHeight) * 100;
    timelinePanelRef.current?.resize(percentage);
  }, []);

  const handleTimelineResize = () => {
    const timelineContainer = document.getElementById("timeline-container");
    if (!timelineContainer) return;

    timeline?.resize(
      {
        height: timelineContainer.clientHeight - 90,
        width: timelineContainer.clientWidth - 40,
      },
      {
        force: true,
      },
    );
  };
  useEffect(() => {
    const onResize = () => handleTimelineResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [timeline, handleTimelineResize]);

  // Suivi de l'état de lecture du player
  useEffect(() => {
    const player = playerRef?.current;
    if (!player) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    player.addEventListener("play", handlePlay);
    player.addEventListener("pause", handlePause);

    return () => {
      player.removeEventListener("play", handlePlay);
      player.removeEventListener("pause", handlePause);
    };
  }, [playerRef]);

  // Gestion des événements clavier
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      
      // Vérifier si l'utilisateur tape dans un champ de texte ou une zone éditable
      const isInTextArea =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true" ||
        target.isContentEditable;

      // Gestion des raccourcis Ctrl+Z (Undo) et Ctrl+Y (Redo)
      if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
        if (event.key === "z" || event.key === "Z") {
          if (isInTextArea) {
            return; // Laisser le comportement normal Ctrl+Z dans les champs de texte
          }
          
          event.preventDefault();
          dispatch(HISTORY_UNDO);
          return;
        }
        
        if (event.key === "y" || event.key === "Y") {
          if (isInTextArea) {
            return; // Laisser le comportement normal Ctrl+Y dans les champs de texte
          }
          
          event.preventDefault();
          dispatch(HISTORY_REDO);
          return;
        }
      }

      // Gestion alternative pour Ctrl+Shift+Z (Redo sur certains systèmes)
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && (event.key === "z" || event.key === "Z")) {
        if (isInTextArea) {
          return; // Laisser le comportement normal dans les champs de texte
        }
        
        event.preventDefault();
        dispatch(HISTORY_REDO);
        return;
      }

      // Gestion de la touche Delete pour supprimer les éléments sélectionnés
      if (event.key === "Delete" && activeIds.length > 0) {
        if (isInTextArea) {
          return; // Laisser le comportement normal dans les champs de texte
        }
        
        event.preventDefault();
        dispatch(LAYER_DELETE);
      }

      // Gestion de la barre d'espace pour lecture/pause
      if (event.key === " " || event.code === "Space") {
        if (isInTextArea) {
          return; // Laisser le comportement normal (espace) dans les champs de texte
        }
        
        event.preventDefault();
        if (isPlaying) {
          dispatch(PLAYER_PAUSE);
        } else {
          dispatch(PLAYER_PLAY);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIds, isPlaying]);

  return (
    <div className="flex h-screen w-screen flex-col">
      <Navbar
        projectName={projectName}
        user={null}
        stateManager={stateManager}
        setProjectName={setProjectName}
      />
      <div className="flex flex-1">
        <ResizablePanelGroup style={{ flex: 1 }} direction="vertical">
          <ResizablePanel className="relative" defaultSize={70}>
            <FloatingControl />
            <div className="flex h-full flex-1">
              <div className="bg-sidebar flex flex-none border-r border-border/80">
                <MenuList />
                <MenuItem />
              </div>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  flex: 1,
                  overflow: "hidden",
                }}
              >
                <CropModal />
                <Scene stateManager={stateManager} />
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            className="min-h-[50px]"
            ref={timelinePanelRef}
            defaultSize={30}
            onResize={handleTimelineResize}
          >
            {playerRef && <Timeline stateManager={stateManager} />}
          </ResizablePanel>
        </ResizablePanelGroup>
        <ControlItem />
      </div>
    </div>
  );
};

export default Editor;
