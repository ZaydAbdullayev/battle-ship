import React, { useEffect, useState } from "react";
import "./battle-board.scss";
import ship1 from "./assets/ship.png";
import ship2 from "./assets/ship-1.png";
import ship3 from "./assets/ship-1.png";
import ship4 from "./assets/ship-2.png";
import { useNavigate } from "react-router-dom";

const GRID_SIZE = 10;
const rows = Array.from({ length: GRID_SIZE }, (_, i) => i + 1);
const cols = "ABCDEFGHIJ".split("");

const shipPalette = [
  { id: 1, name: "Big Pirate", size: 4, img: ship1 },
  { id: 2, name: "Medium Pirate", size: 3, img: ship2 },
  { id: 3, name: "Small Pirate", size: 2, img: ship3 },
  { id: 4, name: "Mini Pirate", size: 1, img: ship4 },
];

const GameBuilder = () => {
  const [selectedShip, setSelectedShip] = useState(null);
  const [placedShips, setPlacedShips] = useState([]);
  const [battleLogs, setBattleLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const battlePhrases = [
      "💥 Cannon fired!",
      "🎯 Direct hit!",
      "🚢 Enemy ship spotted!",
      "🔥 Ship under heavy fire!",
      "💣 Torpedo launched!",
      "🌊 Massive waves incoming!",
      "🦜 Parrot screams orders!",
      "🏴‍☠️ Crew ready for battle!",
    ];

    const interval = setInterval(() => {
      const randomMsg =
        battlePhrases[Math.floor(Math.random() * battlePhrases.length)];
      setBattleLogs((prev) => [...prev, randomMsg]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const isOccupied = (row, col) => {
    return placedShips.some((ship) => {
      for (let i = 0; i < ship.size; i++) {
        const checkCol = ship.col + i;
        if (ship.row === row && checkCol === col) return true;
      }
      return false;
    });
  };

  const handleCellClick = (row, col) => {
    if (!selectedShip) return;

    if (col + selectedShip.size > GRID_SIZE) {
      alert("Ship is out of bounds!");
      return;
    }

    for (let i = 0; i < selectedShip.size; i++) {
      if (isOccupied(row, col + i)) {
        alert("Collision detected!");
        return;
      }
    }

    const newShip = {
      id: selectedShip.id,
      row,
      col,
      size: selectedShip.size,
      img: selectedShip.img,
      owner: "player",
    };

    setPlacedShips((prev) => [...prev, newShip]);
    setSelectedShip(null);
    setBattleLogs((prev) => [
      ...prev,
      `🚢 ${selectedShip.name} placed at ${cols[col]}${row + 1}`,
    ]);

    placeRandomEnemyShip();
  };

  const placeRandomEnemyShip = () => {
    const randomShip =
      shipPalette[Math.floor(Math.random() * shipPalette.length)];

    let found = false;
    let attempts = 0;

    while (!found && attempts < 100) {
      const randomRow = Math.floor(Math.random() * GRID_SIZE);
      const randomCol = Math.floor(
        Math.random() * (GRID_SIZE - randomShip.size + 1)
      );

      let collision = false;
      for (let i = 0; i < randomShip.size; i++) {
        if (isOccupied(randomRow, randomCol + i)) {
          collision = true;
          break;
        }
      }

      if (!collision) {
        const enemyShip = {
          id: randomShip.id,
          row: randomRow,
          col: randomCol,
          size: randomShip.size,
          img: randomShip.img,
          owner: "enemy",
        };

        setTimeout(() => {
          setPlacedShips((prev) => [...prev, enemyShip]);
          setBattleLogs((prev) => [
            ...prev,
            `🏴‍☠️ Enemy ${randomShip.name} 🛳  placed at ${cols[randomCol]}${
              randomRow + 1
            }`,
          ]);
        }, 1000);
        found = true;
      }
      attempts++;
    }
  };

  return (
    <div className="w100 df fdc aic builder-wrapper">
      <div className="w100 df aic jcsb board-header">
        <button className="button" onClick={() => navigate("/")}>
          Menu
        </button>
        <h1>Battle Board</h1>
        <button className="button" onClick={() => navigate("/")}>
          Leave
        </button>
      </div>

      <div className="df gap-20 board-body">
        <div className="palette">
          <h3>Select Ship:</h3>
          {shipPalette.map((ship) => (
            <div
              key={ship.id}
              className={`palette-item ${
                selectedShip?.id === ship.id ? "active" : ""
              }`}
              onClick={() => setSelectedShip(ship)}
            >
              <img src={ship.img} alt={ship.name} />
              <div>{ship.name}</div>
            </div>
          ))}
        </div>

        <div className="grid-wrapper">
          <div className="board-grid">
            <div className="corner"></div>
            {cols.map((letter, idx) => (
              <div key={idx} className="col-header">
                {letter}
              </div>
            ))}

            {rows.map((rowNum, rowIdx) => (
              <React.Fragment key={rowIdx}>
                <div className="row-header">{rowNum}</div>
                {cols.map((_, colIdx) => {
                  let shipHere = null;
                  let isPartOfShip = false;

                  placedShips.forEach((ship) => {
                    for (let i = 0; i < ship.size; i++) {
                      const posCol = ship.col + i;
                      if (ship.row === rowIdx && posCol === colIdx) {
                        shipHere = ship;
                        isPartOfShip = true;
                      }
                    }
                  });

                  let colorClass = "";
                  if (isPartOfShip) {
                    if (shipHere.size === 4) colorClass = "big-ship";
                    else if (shipHere.size === 3) colorClass = "medium-ship";
                    else if (shipHere.size === 2) colorClass = "small-ship";
                    else if (shipHere.size === 1) colorClass = "mini-ship";
                    if (shipHere.owner === "enemy") colorClass += " enemy-ship";
                  }

                  const firstCell = shipHere && shipHere.col === colIdx;

                  return (
                    <div
                      key={`${rowIdx}-${colIdx}`}
                      className={`cell ${colorClass}`}
                      onClick={() => handleCellClick(rowIdx, colIdx)}
                    >
                      {firstCell && (
                        <img
                          src={shipHere.img}
                          alt="ship"
                          style={{
                            width: shipHere.size * 40,
                            height: 40,
                            transform: `translateX(${
                              (shipHere.size - 1) * 20
                            }px)`,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="board-log">
          <h3>Battle Log</h3>
          <div className="log-container">
            {battleLogs
              .slice(-10)
              .reverse()
              .map((log, idx) => (
                <div key={idx} className="log-line">
                  {log}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBuilder;
