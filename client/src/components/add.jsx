import React from "react";

class Add extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="addCoins">
          <button>Coin 1 add</button> +form input
          <button>Coin 2 add</button> +form input
          <button>Coin 3 add</button> +form input
          <button>Coin 4 add</button> +form input
          <button>Coin 5 add</button> +form input
        </div>
      </div>
    );
  }
}

export default Add;
