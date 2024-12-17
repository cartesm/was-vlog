import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  Pagination as PaginationScn,
} from "./ui/pagination";

function Pagination({
  actual,
  total,
  handleClickPaginate,
  setPage,
}: {
  actual: number;
  total: number;
  handleClickPaginate: (page: number) => void;
  setPage: (page: number) => void;
}) {
  return (
    <PaginationScn className="pt-3">
      <PaginationContent>
        {/* primer item */}
        <PaginationItem
          onClick={() => handleClickPaginate(-1)}
          className="rounded-md p-2 hover:bg-secondary  hover:cursor-pointer"
        >
          <ChevronLeft />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            onClick={() => setPage(1)}
            className={`rounded-md hover:cursor-pointer ${actual == 1 && "bg-primary text-secondary"} `}
          >
            1
          </PaginationLink>
        </PaginationItem>
        {/* paginacion intermedia */}
        {total > 1 && (
          <>
            {actual <= 3 ? (
              [2, 3, 4].map((item) => (
                <PaginationItem key={item}>
                  <PaginationLink
                    onClick={() => setPage(item)}
                    className={`rounded-md hover:cursor-pointer ${actual == item && "bg-primary text-secondary"} `}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              ))
            ) : (
              <>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                {[actual - 1, actual, actual + 1]
                  .filter((thisPage) => thisPage <= total && thisPage != total)
                  .map((item) => (
                    <PaginationItem key={item}>
                      <PaginationLink
                        onClick={() => setPage(item)}
                        className={`rounded-md hover:cursor-pointer ${actual == item && "bg-primary text-secondary"} `}
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
              </>
            )}
          </>
        )}
        {/* item final y separador */}
        {total != 1 && total > 4 && (
          <>
            {total - 1 != actual && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                onClick={() => setPage(total)}
                className={`rounded-md hover:cursor-pointer ${actual == total && "bg-primary text-secondary"} `}
              >
                {total}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem
          onClick={() => handleClickPaginate(+1)}
          className="rounded-md p-2 hover:bg-secondary hover:cursor-pointer"
        >
          <ChevronRight />
        </PaginationItem>
      </PaginationContent>
    </PaginationScn>
  );
}

export default Pagination;
