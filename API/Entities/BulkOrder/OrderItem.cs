﻿namespace API.Entities.BulkOrder
{
    public class OrderItem
    {
        public int Id { get; set; }

        public ProductItemIOrdered ItemOrdered { get; set; }

        public long Price { get; set; } 

        public int Quantity { get; set; }   
    }


}