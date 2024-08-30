import { render, screen } from "@testing-library/react";
import { Users, Star } from "lucide-react"; // Assuming these are the icons you're using
import "@testing-library/jest-dom/extend-expect"; // for additional matchers
import { Card } from "@/components/ui/customCard";
import "@testing-library/jest-dom";

describe("Card Component", () => {
  it("should render the Card component with provided props", () => {
    render(
      <Card
        label="Total Users"
        count={1000}
        growth={10}
        Icon={Users}
        BadgeIcon={Star}
        fill="#000"
        badgeClassname="custom-badge"
        footer1="Footer Content 1"
        footer2="Footer Content 2"
      />
    );

    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("1000")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Footer Content 1")).toBeInTheDocument();
    expect(screen.getByText("Footer Content 2")).toBeInTheDocument();
  });

  it("should render loading state correctly", () => {
    render(<Card label="Total Users" count={1000} growth={10} Icon={Users} BadgeIcon={Star} loading={true} />);

    expect(screen.getAllByTestId("custom-loader")).toHaveLength(2); // Assuming `CustomLoader` has `data-testid="custom-loader"`
    expect(screen.queryByText("1000")).not.toBeInTheDocument();
    expect(screen.queryByText("10")).not.toBeInTheDocument();
  });

  it("should render without optional props", () => {
    render(<Card label="Total Users" count={1000} Icon={Users} BadgeIcon={Star} />);

    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("1000")).toBeInTheDocument();
    expect(screen.queryByTestId("custom-loader")).not.toBeInTheDocument(); // Assuming no loading state
    expect(screen.queryByText("Footer Content 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Footer Content 2")).not.toBeInTheDocument();
  });
});
