import { useRef, useState } from "react";

function padInteger(n: number) {
  return n.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
}

const Wizard = () => {
  const [peopleInMeeting, setPeopleInMeeting] = useState(0);
  const [duration, setDuration] = useState(0);
  const [liveTimerActive, setLiveTimerActive] = useState(false);
  const [hourlyCost, setHourlyCost] = useState(100);
  const intervalRef = useRef<NodeJS.Timeout>(undefined);

  return (
    <>
      <div>
        <span className="mr-2">Number of people in meeting:</span>
        <input
          type="number"
          className="border-b-4 border-peachy-dark min-w-16 text-center field-sizing-content not-supports-[field-sizing:content]:w-16"
          value={peopleInMeeting > 0 ? peopleInMeeting : ""}
          onChange={(e) => {
            const value = e.target.value;
            if (!isNaN(+value)) {
              setPeopleInMeeting(+value);
            }
          }}
        />
      </div>

      {peopleInMeeting > 0 && !liveTimerActive ? (
        <>
          <div>
            <span className="mr-2">Duration of meeting:</span>
            <span>
              <input
                type="number"
                className="border-b-4 border-peachy-dark min-w-16 mr-2 text-center field-sizing-content not-supports-[field-sizing:content]:w-16"
                value={duration > 0 ? Math.floor(duration / 60) : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!isNaN(+value)) {
                    setDuration(+value * 60);
                  }
                }}
              />
              <span>mins</span>
            </span>
          </div>
        </>
      ) : null}

      {peopleInMeeting > 0 && liveTimerActive ? (
        <div>
          <div>Time elapsed:</div>
          <div>
            {padInteger(Math.floor(duration / 3600))}:
            {padInteger(Math.floor(duration / 60) % 60)}:
            {padInteger(duration % 60)}
          </div>
        </div>
      ) : null}

      {(peopleInMeeting > 0 && duration > 0) || liveTimerActive ? (
        <div>
          <div className="text-8xl">
            ${Math.round((peopleInMeeting * duration * hourlyCost) / 60 / 60)}
          </div>
        </div>
      ) : null}

      <div className="grow" />

      {peopleInMeeting > 0 && !liveTimerActive ? (
        <div className="text-2xl mx-auto">
          <span className="mr-4">Or</span>
          <button
            className="bg-peachy-surface hover:bg-peachy-surface-hover active:bg-peachy-surface-active rounded-xl w-fit max-w-72 px-8 py-4"
            onClick={() => {
              setLiveTimerActive(true);
              const intervalID = setInterval(() => {
                setDuration((oldDuration) => oldDuration + 1);
              }, 1000);
              intervalRef.current = intervalID;
            }}
          >
            start a live counter
          </button>
        </div>
      ) : null}

      {liveTimerActive ? (
        <button
          className="mx-auto text-2xl bg-peachy-surface hover:bg-peachy-surface-hover active:bg-peachy-surface-active rounded-xl w-fit max-w-72 px-8 py-4"
          onClick={() => {
            setLiveTimerActive(false);
            clearInterval(intervalRef.current);
          }}
        >
          Stop live counter
        </button>
      ) : null}

      <div className="text-lg font-normal italic mx-auto text-center">
        <span>Assumes an hourly labor cost of $</span>
        <input
          type="number"
          className="border-b-1 border-peachy-dark min-w-10 text-center field-sizing-content not-supports-[field-sizing:content]:w-10"
          value={hourlyCost > 0 ? hourlyCost : ""}
          onChange={(e) => {
            const value = e.target.value;
            if (!isNaN(+value)) {
              setHourlyCost(+value);
            }
          }}
        />
        <span className="mr-2">. More silly experiments at</span>
        <a className="underline" href="https://jakob.fun">
          jakob.fun
        </a>
        .
      </div>
    </>
  );
};

export default Wizard;
