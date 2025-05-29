import { useRef, useState } from "react";
import { currencies, currencyOrDefault } from "../data/currencies";
import CurrencyWrapper from "./currencyWrapper";

function padInteger(n: number) {
  return n.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
}

function parseNumberOrFallback(input: string | null, fallback: number) {
  if (input && !isNaN(+input)) {
    return +input;
  }
  return fallback;
}

const Wizard = () => {
  const params = new URLSearchParams(window.location.search);

  const defaultCostUSD = 100;
  const defaultCurrency = "USD";
  const [peopleInMeeting, setPeopleInMeeting] = useState(
    parseNumberOrFallback(params.get("people"), 0),
  );
  const [duration, setDuration] = useState(
    parseNumberOrFallback(params.get("duration"), 0) * 60,
  );
  const [liveTimerActive, setLiveTimerActive] = useState(false);
  const [currency, setCurrency] = useState(
    params.get("currency") ?? defaultCurrency,
  );
  const [hourlyCost, setHourlyCost] = useState(
    parseNumberOrFallback(
      params.get("cost"),
      defaultCostUSD * Math.round(currencyOrDefault(currency).conversion),
    ),
  );
  const [shareButtonText, setShareButtonText] = useState("Copy shareable link");
  const intervalRef = useRef<NodeJS.Timeout>(undefined);

  function getShareableLink() {
    const url = new URL(window.location.origin);

    // Early return if no params. Button shouldn't be visible but just in case.
    if (duration === 0 || peopleInMeeting === 0) {
      return url.toString();
    }

    const urlParams = new URLSearchParams();

    urlParams.set("people", peopleInMeeting.toString());
    urlParams.set("duration", Math.floor(duration / 60).toString());

    if (
      Math.round(hourlyCost / currencyOrDefault(currency).conversion) !==
      defaultCostUSD
    ) {
      urlParams.set("cost", hourlyCost.toString());
    }

    if (currency !== defaultCurrency) {
      urlParams.set("currency", currency);
    }

    return url.toString() + "?" + urlParams.toString();
  }

  function doShareFeedback() {
    const oldText = shareButtonText;
    setShareButtonText("Copied!");
    setTimeout(() => setShareButtonText(oldText), 1000);
  }

  return (
    <>
      <div>
        <label htmlFor="numberOfPeopleInput" className="mr-2">
          Number of people in meeting:
        </label>
        <input
          id="numberOfPeopleInput"
          inputMode="numeric"
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

      {peopleInMeeting > 0 && !liveTimerActive && (
        <div>
          <label htmlFor="durationInput">
            <span className="mr-2">Duration of meeting:</span>
            <input
              id="durationInput"
              inputMode="numeric"
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
          </label>
        </div>
      )}

      {peopleInMeeting > 0 && liveTimerActive && (
        <div>
          <div>Time elapsed:</div>
          <div>
            {padInteger(Math.floor(duration / 3600))}:
            {padInteger(Math.floor(duration / 60) % 60)}:
            {padInteger(duration % 60)}
          </div>
        </div>
      )}

      {((peopleInMeeting > 0 && duration > 0) || liveTimerActive) && (
        <div>
          <div className="text-6xl">
            <CurrencyWrapper currencyPattern={currencyOrDefault(currency).unit}>
              {Math.round((peopleInMeeting * duration * hourlyCost) / 60 / 60)}
            </CurrencyWrapper>
          </div>
          {!liveTimerActive && (
            <button
              className="text-lg font-normal italic underline"
              onClick={() => {
                navigator.clipboard
                  .writeText(getShareableLink())
                  .then(doShareFeedback);
              }}
            >
              {shareButtonText}
            </button>
          )}
        </div>
      )}

      <div className="grow" />

      {peopleInMeeting > 0 && !liveTimerActive && (
        <div className="text-2xl mx-auto">
          <span className="mr-4">Or</span>
          <button
            className="bg-peachy-surface hover:bg-peachy-surface-hover active:bg-peachy-surface-active rounded-xl w-fit max-w-72 px-8 py-4"
            onClick={() => {
              setDuration(0);
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
      )}

      {liveTimerActive && (
        <button
          className="mx-auto text-2xl bg-peachy-surface hover:bg-peachy-surface-hover active:bg-peachy-surface-active rounded-xl w-fit max-w-72 px-8 py-4"
          onClick={() => {
            setLiveTimerActive(false);
            clearInterval(intervalRef.current);
          }}
        >
          Stop live counter
        </button>
      )}

      <div className="text-lg font-normal italic mx-auto text-center">
        <label htmlFor="currencySelect">Currency:</label>
        <select
          name="currency"
          id="currencySelect"
          className="mr-1 underline"
          value={currency}
          onChange={(e) => {
            const newCurrency = e.target.value;
            setHourlyCost((oldCost) =>
              Math.round(
                (oldCost * currencyOrDefault(newCurrency).conversion) /
                  currencyOrDefault(currency).conversion,
              ),
            );
            setCurrency(newCurrency);
          }}
        >
          {Object.keys(currencies).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label htmlFor="hourlyCostInput" className="mr-1">
          Assumes an hourly labor cost of
        </label>
        <CurrencyWrapper currencyPattern={currencyOrDefault(currency).unit}>
          <input
            id="hourlyCostInput"
            type="number"
            inputMode="numeric"
            className="border-b-1 border-peachy-dark min-w-10 text-center field-sizing-content not-supports-[field-sizing:content]:w-10"
            value={hourlyCost > 0 ? hourlyCost : ""}
            onChange={(e) => {
              const value = e.target.value;
              if (!isNaN(+value)) {
                setHourlyCost(+value);
              }
            }}
          />
        </CurrencyWrapper>
        <span className="mr-1">.</span>

        <span className="mr-1">More silly experiments at</span>
        <a className="underline" href="https://jakob.fun">
          jakob.fun
        </a>
        <span>.</span>
      </div>
    </>
  );
};

export default Wizard;
