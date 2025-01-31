import { Component } from "react";

interface ClickableCardProps {
  title: string;
}

export class ClickableCard extends Component<ClickableCardProps> {
  render() {
    const { title } = this.props;
    return (
      <div>
        <div>
          <p>{title}</p>
        </div>
      </div>
    );
  }
}
