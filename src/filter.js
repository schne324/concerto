
class Filtration {
  constructor(data) {
    this.data = data;
  }

  filter(config) {
    return this.data.filter((d) => d[config.name] === config.value);
  }
}

export default Filtration;