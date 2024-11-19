"use client"

import { ListingsWithTalentsInterface } from "@/components/Listing";

export function searchByTitle(
    keyword: string,
    listings: ListingsWithTalentsInterface
  ) {
   return {
      listings: listings.listings.filter((item) => {
        return item.name.includes(keyword);
      }),
    };
  }
  
  export function searchByDescription(
    keyword: string,
    listings: ListingsWithTalentsInterface
  ) {
    return {
      listings: listings.listings.filter((item) => {
        return item.description.includes(keyword);
      }),
    };
  }
  
  export function searchByTalent(
    talent: string,
    listings: ListingsWithTalentsInterface
  ) {
    return {
      listings: listings.listings.filter((item) => {
        return (
          item.talents.filter((subitem) => {
            return subitem.includes(talent);
          }).length > 0
        );
      }),
    };
  }
  