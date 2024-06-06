import {useForm} from "react-hook-form";
import { useState, useEffect } from "react";
import { api } from "../config_axios";
import ItemLista from "./ItemLista";  

const Manutencao_receita = () => {
    //servem para manipular os dados do formulário
    const {register, handleSubmit, reset} = useForm();
    //guardar e setar as informações do objeto
    const [revenue, setRevenue] = useState([]);

    const obterLista = async () => {
        try{
            const lista = await api.get("revenue/all");
            setRevenue(lista.data);
        }catch(error){
            alert(`Erro: ..Não foi possível obter os dados: ${error}`);
        }
    }


//define o método que será executado assim que o componente
// for renderizado
useEffect(() => {
    obterLista();
},[]);

const filtrarLista = async (campos) => {
    try{
        const lista = await api.get(`/revenue/filtro${campos.palavra}`);
        lista.data.length
        ? setRevenue(lista.data)
        : alert("Não há receita cadastradas com a palavra chave pesquisada");
    }catch(error){
        alert(`Erro: ..Não foi possível obter os dados: ${error}`);
    }
}

const excluir = async(id,titulo) => {
    if(!window.confirm(`Confirma a exclusão da Receita ${titulo}?`)){
        return;
    }
    try{
        console.log("id é:"+id)
        await api.delete(`revenue/${id}`);
        //formar uma nova lista de tarefas sem a tarefa que foi excluida
        setRevenue(revenue.filter(Revenue => revenue.id !== id));
        location.reload();
    }catch(error){
        alert(`Erro: ..Não foi possível excluir a receita ${titulo}: ${error}`);
    }
}

//alterar os registros
const alterar = async (id,name,index) => {
    const novoStatus = prompt(`Digite o novo nome da receita ${name}`);
    if (novoStatus == "" ) {
        alert('Digite um nome válido!(nome em branco)')
        return;
    }
    try{//captura os erros 
        //chamando o backend e passando os dados
        await api.put(`revenue/updateRevenue/${id}`,{name: novoStatus});
        
        const RevenueUpdate = [...revenue];
        const RevenueIndex = RevenueUpdate.find(Revenue => Revenue.id === id);
        console.log("indice da receita: "+RevenueIndex);
        RevenueUpdated[RevenueIndex.id].name = novoStatus;
        setRevenue(RevenueUpdated);
        obterLista();
        location.reload();
    }catch(error){
        alert(`Erro: ..Não foi possível alterar a tarefa ${titulo}: ${error}`);
    }
}

    return (
       <div className="container">
        <div className="row">
            <div className="col-sm-7">
                <h4 className="fst-italic mt-3">Atualização da receita</h4>
            </div>
            <div className="col-sm-5">
                <form onSubmit={handleSubmit(filtrarLista)}>
                    <div className="input-group mt-3">
                        <input type="text" className="form-control" placeholder="Titulo" required {...register("palavra")} />
                        <input type="submit" class="btn btn-outline-primary" value="Pesquisar" />
                        <input type="button" class="btn btn-outline-danger" value="Todas asReceitas" onClick={()=>{reset({palavra:""});obterLista();}}/>
                    </div>
                </form>
            </div>
        </div>

        <table className="table table-striped mt-3">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Ingredient</th>
                    <th>Introduction</th>
                    <th>Method Preparation</th>
                    <th>Nutritional Information</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {revenue.map((revenue) => (
                    <ItemLista
                        key={revenue.id}
                        id={revenue.id}
                        name={revenue.name}
                        introduction={revenue.introduction}
                        ingredient={revenue.ingredient}
                        method_preparation={revenue.method_preparation}
                        nutritional_information={revenue.nutritional_information}
                        excluirClick={()=>excluir(revenue.id,revenue.name)}
                        alterarClick={()=>alterar(revenue.id,revenue.name)}
                    />
                ))}
            </tbody>
        </table>

       </div> 
    );
};

export default Manutencao_receita;