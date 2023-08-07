const formulario = document.getElementById("cantidad");
const grafica = document.getElementById("myChart");
let mychart;

const getIndicadores = async (nombremonedas) => {
  try {
    const valores = await fetch(`https://mindicador.cl/api/${nombremonedas}`);
    const resultado = await valores.json();
    console.log(resultado);
    return resultado.serie;
  } catch (errores) {
    alert(errores.message);
  }
};
getIndicadores("dolar");

const totalMoney = (valor, datos) => {
  const valormoneda = datos[0].valor; //dolar
  const total = valor / valormoneda; //1000 / 800
  return Math.round(total * 100) / 100;
};

const showTotalOnScreen = (total) => {
  document.getElementById("resultados").innerHTML = total;
};
const getData = (datos) => {
  return datos.map((item) => item.valor);
};
const getDate = (data) => {
  return data.map((item) => new Date(item.fecha).toLocaleDateString("en-US"));
};

const destroy = () => {
  if (mychart) {
    mychart.destroy();
  }
};

const calcCurrencyValue = async (valor, moneda) => {
  const datos = await getIndicadores(moneda);
  showGraphic(datos, valor);
};

const showGraphic = (datos, valor) => {
  const total = totalMoney(valor, datos);
  showTotalOnScreen(total);

  const labels = getDate(datos).splice(0, 10);
  const values = getData(datos).splice(0, 10);

  const datasets = [
    {
      label: "Moneda",
      borderColor: "rgb(0, 164, 0)",
      data: values,
    },
  ];

  const config = {
    type: "line",
    data: {
      labels,
      datasets,
    },
  };

  destroy();

  grafica.style.backgroundColor = "white";

  mychart = new Chart(grafica, config);
};

formulario.addEventListener("submit", async (event) => {
  event.preventDefault();

  const valor = formulario.elements["ingresemonto"].value;
  const moneda = formulario.elements["monedas"].value;
  if (!valor) {
    alert("ingrese monto");
    return;
  }

  if (!moneda) {
    alert("Seleccione una moneda");
    return;
  }

  await calcCurrencyValue(valor, moneda);
});
