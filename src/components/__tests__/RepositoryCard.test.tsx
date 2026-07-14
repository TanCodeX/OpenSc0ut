import { render, screen } from "@testing-library/react";
import RepositoryCard from "../features/RepositoryCard";
import { Repository } from "../../types/types";

const mockRepository: Repository = {
  id: 1,
  name: "react",
  full_name: "facebook/react",
  html_url: "https://github.com/facebook/react",
  description: "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
  owner: {
    login: "facebook",
    avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4",
    html_url: "https://github.com/facebook",
    type: "Organization",
  },
  stargazers_count: 200000,
  forks_count: 40000,
  open_issues_count: 1200,
  language: "JavaScript",
  topics: ["react", "frontend", "javascript"],
  updated_at: "2023-10-10T10:00:00Z",
  created_at: "2013-05-24T16:15:54Z",
  has_issues: true,
};

describe("RepositoryCard", () => {
  it("renders repository name and description", () => {
    render(<RepositoryCard repository={mockRepository} />);
    expect(screen.getAllByText("react")[0]).toBeInTheDocument();
    expect(screen.getByText(/A declarative, efficient, and flexible JavaScript library/i)).toBeInTheDocument();
  });

  it("renders owner details", () => {
    render(<RepositoryCard repository={mockRepository} />);
    expect(screen.getByText("facebook")).toBeInTheDocument();
    expect(screen.getByAltText("facebook's avatar")).toBeInTheDocument();
  });

  it("renders stats correctly", () => {
    render(<RepositoryCard repository={mockRepository} />);
    expect(screen.getByText("200,000")).toBeInTheDocument();
    expect(screen.getByText("40,000")).toBeInTheDocument();
    expect(screen.getByText("1,200")).toBeInTheDocument();
  });

  it("renders language and topics", () => {
    render(<RepositoryCard repository={mockRepository} />);
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getAllByText("react").length).toBeGreaterThan(0);
    expect(screen.getByText("frontend")).toBeInTheDocument();
  });
});
