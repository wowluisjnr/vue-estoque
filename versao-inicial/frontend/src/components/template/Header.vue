<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="primary">
            <b-navbar-brand href="#">StockRoon</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>

            <b-navbar-nav>
                <b-nav-item href="/">Estoque Atual</b-nav-item>  

                <!-- <b-nav-item href="/newentry">Nova Entrada</b-nav-item>                  -->

                <b-nav-item-dropdown text="Gerenciar Pedidos" right>
                <b-dropdown-item href="/neworder">Novo pedido</b-dropdown-item>
                <b-dropdown-item href="/ordersreceived">Caixa de entrada</b-dropdown-item>
                <b-dropdown-item href="#">Relatorio de pedidos</b-dropdown-item>
                </b-nav-item-dropdown>
                
                <b-nav-item-dropdown text="Gerenciar Sistema" right>
                <b-dropdown-item href="#">Gerenciar Usuarios</b-dropdown-item>
                <b-dropdown-item href="/medicament">Cadastro de Medicamentos</b-dropdown-item>
                <b-dropdown-item href="/movements">Relatorio de Movimentações</b-dropdown-item>
                <b-dropdown-item href="#">Gerenciar Lotes</b-dropdown-item>                
                </b-nav-item-dropdown>

            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">               

                <b-nav-item-dropdown right>
                <!-- Using 'button-content' slot -->
                <template slot="button-content"><em>Luiz Claudio</em></template>
                <b-dropdown-item href="#">Configurações</b-dropdown-item>
                <b-dropdown-item href="#">Sair</b-dropdown-item>
                </b-nav-item-dropdown>
            </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
export default {
    name: 'Header'

}
</script>

<style>

</style>
