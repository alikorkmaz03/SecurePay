﻿import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { BasketItem } from "../../app/models/basket";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "./basketSlice";
interface Props {
    items: BasketItem[];
    isBasket?: boolean;

}


export default function BasketTable({ items, isBasket = true }: Props) {

    const { status } = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();
    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Ürün</TableCell>
                            <TableCell align="right">Fiyat</TableCell>
                            <TableCell align="center">Adet</TableCell>
                            <TableCell align="right">Ara Toplam</TableCell>
                            {isBasket && <TableCell align="right"></TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.productId} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                <TableCell component="th" scope="row">
                                    <Box display="flex" alignItems="center">
                                        <img src={item.pictureUrl} alt={item.name} style={{ height: 50, marginRight: 20 }} />
                                        <span>{item.name}</span>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">
                                    {(item.price / 100).toFixed(2)} {` `} TRY
                                </TableCell>
                                <TableCell align="center">
                                    {isBasket && (
                                        /* sepetten ürün çıkarmak için */
                                        <LoadingButton
                                            loading={status === "pendingRemoveItem" + item.productId + "rem"}
                                            onClick={() =>
                                                dispatch(removeBasketItemAsync({ productId: item.productId, quantity: 1, name: "rem" }))
                                            }
                                            color="error"
                                            size="small"
                                        >
                                            <Remove />
                                        </LoadingButton>
                                    )}
                                    {item.quantity}
                                    {isBasket && (
                                        <LoadingButton
                                            loading={status === "pendingAddItem" + item.productId}
                                            onClick={() => dispatch(addBasketItemAsync({ productId: item.productId, quantity: 1 }))}
                                            color="success"
                                            size="small"
                                        >
                                            <Add />
                                        </LoadingButton>
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    {((item.price / 100) * item.quantity).toFixed(2)} {` `}TRY
                                </TableCell>
                                {isBasket && (
                                    <TableCell align="right">
                                        <LoadingButton
                                            loading={status === "pendingRemoveItem" + item.productId + "del"}
                                            onClick={() =>
                                                dispatch(removeBasketItemAsync({ productId: item.productId, quantity: item.quantity, name: "del" }))
                                            }
                                            color="error"
                                            size="small"
                                        >
                                            <Delete />
                                        </LoadingButton>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}