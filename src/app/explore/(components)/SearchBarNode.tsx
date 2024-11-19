import { ReactNode } from "react";

import { ListingsWithTalentsInterface } from "@/components/Listing";

import TitleSearchBar from "./TitleSearchBar";
import DescriptionSearchBar from "./DescriptionSearchBar";
import TalentSearchBar from "./TalentSearchBar";

export class SearchBarNodeFactory {
  listings: ListingsWithTalentsInterface;

  constructor(listings: ListingsWithTalentsInterface) {
    this.listings = listings;
  }

  getSearchBar(searchBarType: string): SearchBarNode | undefined {
    switch (searchBarType) {
      case "title":
        return new TitleSearchBarNode(this.listings);
        break;
      case "description":
        return new DescriptionSearchBarNode(this.listings);
        break;
      case "talents":
        return new TalentSearchBarNode(this.listings);
        break;
    }
  }
}

abstract class SearchBarNode {
  listings: ListingsWithTalentsInterface;

  constructor(listings: ListingsWithTalentsInterface) {
    this.listings = listings;
  }

  abstract getReactNode(): ReactNode;
}

class TitleSearchBarNode extends SearchBarNode {
  constructor(listings: ListingsWithTalentsInterface) {
    super(listings);
  }

  getReactNode() {
    return <TitleSearchBar listings={this.listings} />;
  }
}

class DescriptionSearchBarNode extends SearchBarNode {
  constructor(listings: ListingsWithTalentsInterface) {
    super(listings);
  }

  getReactNode() {
    return <DescriptionSearchBar listings={this.listings} />;
  }
}

class TalentSearchBarNode extends SearchBarNode {
  constructor(listings: ListingsWithTalentsInterface) {
    super(listings);
  }

  getReactNode() {
    return <TalentSearchBar listings={this.listings} />;
  }
}
