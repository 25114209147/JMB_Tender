from typing import Tuple, List, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import Select, func


def normalize_pagination_params(page: int, page_size: int, max_page_size: int = 100) -> Tuple[int, int, int]:
    page = max(page, 1)
    page_size = min(max(page_size, 1), max_page_size)
    offset = (page - 1) * page_size
    return page, page_size, offset


def calculate_total_pages(total_count: int, page_size: int) -> int:
    return (total_count + page_size - 1) // page_size


async def paginate_query(
    db: AsyncSession,
    query: Select,
    count_query: Select,
    page: int,
    page_size: int
) -> Tuple[List[Any], int, int]:
 
    # Execute queries
    result = await db.execute(query)
    items = list(result.unique().scalars().all())
    
    total_count_result = await db.execute(count_query)
    total_count = total_count_result.scalar_one()
    total_pages = calculate_total_pages(total_count, page_size)
    
    return items, total_count, total_pages
