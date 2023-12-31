import { createContext, useContext, useEffect, useState } from "react";

export const CarrinhoContext = createContext();
CarrinhoContext.displayName = "Carrinho"

export const CarrinhoProvider = ({children}) =>{
    const [carrinho, setCarrinho] = useState([]);
    const [totalProdutos, setTotalProdutos] = useState(0);
    
    return (
        <CarrinhoContext.Provider value={{carrinho, setCarrinho, totalProdutos, setTotalProdutos}}>
            {children}
        </CarrinhoContext.Provider>
    )
}

export const useCarrinhoContext = () =>{
    const {carrinho, setCarrinho, 
           totalProdutos, setTotalProdutos} = useContext(CarrinhoContext);
    
    function mudarQuantidade(id, qtd){
        return carrinho.map(item => {
            if (item.id === id) item.quantidade += qtd;
            return item;
        })
    }

    function addProduto(novoProduto){
        const temProduto = carrinho.some(item => item.id === novoProduto.id);
        // se não tem o produto no carrinho
        if (!temProduto){
          novoProduto.quantidade= 1;
          return setCarrinho(carrinhoAnterior => 
            [...carrinhoAnterior, novoProduto]);
        }
        // se o produto já existe no carrinho alterar somente a quantidade
        setCarrinho(mudarQuantidade(novoProduto.id,1));
        /*
        setCarrinho(item => item.map(itemDoCarrinho => {
          if (itemDoCarrinho.id === novoProduto.id) itemDoCarrinho.quantidade +=1;
          return itemDoCarrinho;
        }));
        */
    }

    function removeProduto(id){
        const produto = carrinho.find(item => item.id ===id);
        const isLast = produto.quantidade === 1;
        if (isLast){
            return setCarrinho(itemCarinho => itemCarinho.filter(item=> item.id!== id));
        }
        setCarrinho(mudarQuantidade(id,-1));
        /*
        setCarrinho(itemCarinho => itemCarinho.map(item=>{
            if(item.id === id) item.quantidade -=1;
            return item;
        }))
        */
    }

   useEffect(()=>{
    const novaQtd = carrinho.reduce((contador,produto) =>
         contador + produto.quantidade, 0);
         setTotalProdutos(novaQtd);
   },[carrinho, setTotalProdutos]);
   
   return {
    carrinho, setCarrinho, 
    addProduto, removeProduto, 
    totalProdutos, setTotalProdutos
   }
}