import mapboxgl from "mapbox-gl";

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
    currency: "USD",
  }).format(amount);
};

const getEstimateAmountLabel = (amount: number) => {
  const el = document.createElement("span");

  el.style.fontSize = "12px";
  el.style.lineHeight = "18px";
  el.style.fontWeight = "700";
  el.style.color = "#222222";
  el.style.margin = "0 8px";

  el.innerText = formatAmount(amount);

  return el;
};

const getEstimateValueIcon = (iconName: "buildings" | "circleDollar") => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.setAttribute("viewBox", "0 0 48 48");
  svg.setAttribute("fill", "none");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    iconName === "buildings"
      ? "M42 3H27C25.3125 3 24 4.40625 24 6V42C24 43.6875 25.3125 45 27 45H42C43.5938 45 45 43.6875 45 42V6C45 4.40625 43.5938 3 42 3ZM27 0H42C45.2813 0 48 2.71875 48 6V42C48 45.375 45.2813 48 42 48H27C23.625 48 21 45.375 21 42V6C21 2.71875 23.625 0 27 0ZM18 12V15H6C4.3125 15 3 16.4063 3 18V42C3 43.6875 4.3125 45 6 45H18.4688C18.8438 46.125 19.5 47.1563 20.25 48H6C2.625 48 0 45.375 0 42V18C0 14.7188 2.625 12 6 12H18ZM8.25 30H12.75C13.9688 30 15 31.0313 15 32.25V36.75C15 38.0625 13.9688 39 12.75 39H8.25C6.9375 39 6 38.0625 6 36.75V32.25C6 31.0313 6.9375 30 8.25 30ZM9 36H12V33H9V36ZM30 36.75V32.25C30 31.0313 30.9375 30 32.25 30H36.75C37.9688 30 39 31.0313 39 32.25V36.75C39 38.0625 37.9688 39 36.75 39H32.25C30.9375 39 30 38.0625 30 36.75ZM33 36H36V33H33V36ZM8.25 18H12.75C13.9688 18 15 19.0313 15 20.25V24.75C15 26.0625 13.9688 27 12.75 27H8.25C6.9375 27 6 26.0625 6 24.75V20.25C6 19.0313 6.9375 18 8.25 18ZM9 24H12V21H9V24ZM30 8.25C30 7.03125 30.9375 6 32.25 6H36.75C37.9688 6 39 7.03125 39 8.25V12.75C39 14.0625 37.9688 15 36.75 15H32.25C30.9375 15 30 14.0625 30 12.75V8.25ZM33 9V12H36V9H33ZM32.25 27C30.9375 27 30 26.0625 30 24.75V20.25C30 19.0313 30.9375 18 32.25 18H36.75C37.9688 18 39 19.0313 39 20.25V24.75C39 26.0625 37.9688 27 36.75 27H32.25ZM33 21V24H36V21H33Z"
      : "M45 23.9531C45 16.4531 40.9688 9.60938 34.5 5.85938C27.9375 2.01563 19.9688 2.01563 13.5 5.85938C6.9375 9.60938 3 16.4531 3 23.9531C3 31.5469 6.9375 38.3906 13.5 42.1406C19.9688 45.9844 27.9375 45.9844 34.5 42.1406C40.9688 38.3906 45 31.5469 45 23.9531ZM0 23.9531C0 15.4219 4.5 7.54688 12 3.23438C19.4063 -1.07813 28.5 -1.07813 36 3.23438C43.4063 7.54688 48 15.4219 48 23.9531C48 32.5781 43.4063 40.4531 36 44.7656C28.5 49.0781 19.4063 49.0781 12 44.7656C4.5 40.4531 0 32.5781 0 23.9531ZM25.5 11.2031V13.3594C26.7188 13.4531 27.9375 13.8281 29.1563 14.2031C29.3438 14.2031 29.4375 14.2969 29.625 14.2969C30.375 14.4844 30.8438 15.3281 30.6563 16.1719C30.4688 16.9219 29.625 17.3906 28.7813 17.2031C28.5938 17.1094 28.3125 17.1094 28.125 17.0156C27.4688 16.8281 26.7188 16.5469 25.9688 16.4531C24.1875 16.2656 22.5938 16.4531 21.375 16.9219C20.1563 17.4844 19.5938 18.2344 19.5 18.7969C19.3125 19.7344 19.6875 20.2969 20.4375 20.8594C21.4688 21.4219 22.9688 21.8906 24.75 22.3594V22.4531C26.4375 22.9219 28.4063 23.4844 29.9063 24.4219C31.6875 25.6406 32.4375 27.6094 32.0625 29.7656C31.6875 31.7344 30.2813 33.1406 28.5 33.7969C27.6563 34.1719 26.5313 34.4531 25.4063 34.4531V36.7031C25.4063 37.5469 24.75 38.2031 23.9063 38.2031C23.1563 38.2031 22.4063 37.5469 22.4063 36.7031V34.3594C21.6563 34.1719 20.4375 33.7969 19.4063 33.5156C18.75 33.3281 18.0938 33.1406 17.4375 32.9531C16.6875 32.6719 16.2188 31.8281 16.5 30.9844C16.7813 30.2344 17.625 29.8594 18.375 30.0469C19.0313 30.2344 19.5938 30.5156 20.25 30.7031C21.2813 30.9844 22.4063 31.2656 22.875 31.3594C24.75 31.6406 26.3438 31.4531 27.375 31.0781C28.4063 30.6094 28.9688 29.9531 29.1563 29.2031C29.25 28.1719 28.9688 27.4219 28.125 26.8594C27 26.1094 25.6875 25.7344 24.2813 25.3594C24.0938 25.3594 23.9063 25.2656 23.7188 25.1719C22.0313 24.7969 20.25 24.2344 18.8438 23.2969C18.0938 22.8281 17.3438 22.1719 16.875 21.3281C16.4063 20.3906 16.3125 19.3594 16.5 18.2344C16.875 16.2656 18.375 14.9531 20.1563 14.2031C20.8125 13.9219 21.6563 13.6406 22.4063 13.5469V11.2031C22.4063 10.4531 23.0625 9.70313 23.9063 9.70313C24.75 9.70313 25.4063 10.4531 25.4063 11.2031H25.5Z",
  );
  path.setAttribute("fill", "#1470FF");
  svg.appendChild(path);

  const el = document.createElement("div");
  el.style.width = "14px";
  el.style.height = "14px";
  el.appendChild(svg);

  return el;
};

const getEstimateValueContainer = (valueType: "sqFt" | "annualProjection") => {
  const el = document.createElement("div");

  el.style.display = "flex";
  el.style.alignItems = "center";
  if (valueType === "sqFt") {
    el.style.marginRight = "4px";
  } else if (valueType === "annualProjection") {
    el.style.marginLeft = "4px";
  }

  return el;
};

const getEstimateValueSummaryContainer = () => {
  const el = document.createElement("div");

  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "space-between";

  return el;
};

const getEstimateValueCard = () => {
  const el = document.createElement("div");

  el.style.position = "absolute";
  el.style.top = "5px";
  el.style.left = "48px";
  el.style.borderRadius = "8px";
  el.style.padding = "8px";
  el.style.background = "#ffffff";
  el.style.boxShadow = "0 10px 30px 0 rgba(0, 0, 0, .1)";

  return el;
};

const getEstimateValuePinIcon = (isMain: boolean) => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.setAttribute("viewBox", "0 0 50 50");
  svg.setAttribute("fill", "none");

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M39.5846 20.3125C39.5846 32.0312 25.0013 43.75 25.0013 43.75C25.0013 43.75 10.418 32.0312 10.418 20.3125C10.418 12.546 16.9471 6.25 25.0013 6.25C33.0555 6.25 39.5846 12.546 39.5846 20.3125Z",
  );
  path.setAttribute("fill", isMain ? "#1470FF" : "#00AEEF");
  path.setAttribute("stroke", "white");
  path.setAttribute("strokeWidth", "2");
  path.setAttribute("strokeLinecap", "round");
  path.setAttribute("stroke-join", "round");
  svg.appendChild(path);

  const ellipse = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "ellipse",
  );
  ellipse.setAttribute("cx", "25");
  ellipse.setAttribute("cy", "20.834");
  ellipse.setAttribute("rx", "6.25");
  ellipse.setAttribute("ry", "6.25");
  ellipse.setAttribute("fill", "white");
  svg.appendChild(ellipse);

  const el = document.createElement("div");
  el.style.width = "50px";
  el.style.height = "50px";
  el.appendChild(svg);

  return el;
};

export const createAirRightEstimateMarker = (
  map: mapboxgl.Map,
  airRightEstimate: any,
) => {
  const {
    estimate: { value: estValue, annualProjection: estAnnualProjection },
    isMain,
    lon,
    lat,
  } = airRightEstimate;

  const estValueLabel = getEstimateAmountLabel(Number(estValue));
  const estValueIcon = getEstimateValueIcon("buildings");
  const estValueContainer = getEstimateValueContainer("sqFt");
  estValueContainer.appendChild(estValueIcon);
  estValueContainer.appendChild(estValueLabel);

  const estAnnualProjectionLabel = getEstimateAmountLabel(
    Number(estAnnualProjection),
  );
  const estAnnualProjectionIcon = getEstimateValueIcon("circleDollar");
  const estAnnualProjectionContainer =
    getEstimateValueContainer("annualProjection");
  estAnnualProjectionContainer.appendChild(estAnnualProjectionIcon);
  estAnnualProjectionContainer.appendChild(estAnnualProjectionLabel);

  const summaryContainer = getEstimateValueSummaryContainer();
  summaryContainer.appendChild(estValueContainer);
  summaryContainer.appendChild(estAnnualProjectionContainer);

  const pinIcon = getEstimateValuePinIcon(isMain);

  const markerContainer = document.createElement("div");
  markerContainer.appendChild(pinIcon);

  if (airRightEstimate.estimate) {
    const card = getEstimateValueCard();
    card.appendChild(summaryContainer);
    markerContainer.appendChild(card);
  }

  const marker = new mapboxgl.Marker(markerContainer, { anchor: "bottom" })
    .setLngLat(new mapboxgl.LngLat(lon, lat))
    .addTo(map);

  return marker;
};
