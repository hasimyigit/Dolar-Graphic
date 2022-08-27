import React, { useEffect, useState } from "react";
import Sparkline from "sparklines";
import items from "../data";
import "./App.scss";
const App = () => {
  const [canvas, setCanvas] = useState(null);
  const [current, setCurrent] = useState(null);
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(null);
  const [clientX, setClientX] = useState(null);
  let div = null;

  //didMount
  useEffect(() => {
    setData(items.reverse());
    div = document.querySelector(".sparkline");

    setCanvas(
      new Sparkline(div, {
        width: window.innerWidth+9,
        heigth: window.innerHeight / 2,
        minValue: 1,
        maxValue: 14,
        lineWidth: 0,
        dotRadius: 5,
        minColor: "green",
        maxColor: "red",
        endColor: "transparent",
      })
    );
  }, []);

  useEffect(() => {
    if (canvas) {
        canvas.draw(
            data.reduce((acc, item) => {
              return [...acc, parseFloat(item.now.replace(",", "."))];
            }, [])
          );
      document.addEventListener("mousemove", (e) => {
        const percent = (e.clientX / (window.innerWidth - 1)) * 100;
        const currentIndex = Math.ceil((percent * data.length) / 100);
        setIndex(currentIndex > 0 ? currentIndex - 1 : 0);
        setClientX(e.clientX)
      });
    }
  }, [canvas]);
  useEffect(() => {
    if (index) {
      setCurrent(data[index]);
      canvas.draw(
        data.slice(0, index + 1).reduce((acc, item) => {
          return [...acc, parseFloat(item.now.replace(",", "."))];
        }, [])
      );
    }
  }, [index]);

  const formatDate = (date) => {
    const [day, month, year] = date.split(".");
    return new Intl.DateTimeFormat("tr-TR", {
      dateStyle: "long",
    }).format(new Date(`${year}-${month}-${day}`));
  };
  return (
    <div className="container">
      {clientX > 0  && <div className="line" style={{'--position': clientX+'px'}}></div>}

      <div className="headline">
        {current !==null ? (
          <>
            <h1>{formatDate(current.date)}</h1>
            <p>1 USD = {current.now} TRY</p>
          </>
        ): <h1>Mouse Move!</h1>}
      </div>
      <div  style={{'--width': clientX+9+'px'}} className="sparkline"></div>
    </div>
  );
};

export default App;
