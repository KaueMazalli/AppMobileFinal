import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const TelaProduto = () => {
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productName, setProductName] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productSize, setProductSize] = useState('');

  // Configurações do seu projeto Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyBtzdJ-Pu-wIB_a4vtcrBUJQbVKIZUgtd4",
    authDomain: "mobilefinal-a09f0.firebaseapp.com",
    projectId: "mobilefinal-a09f0",
    storageBucket: "mobilefinal-a09f0.appspot.com",
    messagingSenderId: "486098062830",
    appId: "1:486098062830:web:eb3651605aa1e527f852ff"
  };

  // Inicialize o Firebase
  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app); // Obtenha uma instância do Firestore

  // Função para buscar os produtos do Firestore
  const fetchProducts = async () => {
    try {
      const productsCollection = await collection(firestore, 'produtos');
      const productsSnapshot = await getDocs(productsCollection);
      const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  // Chamada para buscar os produtos quando o componente montar
  useEffect(() => {
    fetchProducts();
  }, []);

  // Função para adicionar um novo produto
  const confirmAddProduct = () => {
    if (!productName || !productBrand || !productPrice || !productSize) {
      setErrorMessage('Todos os campos são obrigatórios!');
      setErrorModalVisible(true);
      return;
    }
    setConfirmationAction(() => addProduct);
    setConfirmationModalVisible(true);
  };

  const addProduct = async () => {
    try {
      await addDoc(collection(firestore, 'produtos'), {
        nome: productName,
        marca: productBrand,
        preço: productPrice,
        tamanho: productSize,
      });
      resetAddModal();
      fetchProducts();
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  };

  // Função para abrir o modal de edição com os dados do produto selecionado
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setProductName(product.nome);
    setProductBrand(product.marca);
    setProductPrice(product.preço);
    setProductSize(product.tamanho);
    setEditModalVisible(true);
  };

  const confirmEditProduct = () => {
    if (!productName || !productBrand || !productPrice || !productSize) {
      setErrorMessage('Todos os campos são obrigatórios!');
      setErrorModalVisible(true);
      return;
    }
    setConfirmationAction(() => editProduct);
    setConfirmationModalVisible(true);
  };

  const editProduct = async () => {
    try {
      await updateDoc(doc(firestore, 'produtos', selectedProduct.id), {
        nome: productName,
        marca: productBrand,
        preço: productPrice,
        tamanho: productSize,
      });
      resetEditModal();
      fetchProducts();
    } catch (error) {
      console.error('Erro ao editar produto:', error);
    }
  };

  // Função para confirmar a remoção do produto
  const confirmRemoveProduct = (productId) => {
    setSelectedProduct(productId);
    setConfirmationAction(() => removeProduct);
    setConfirmationModalVisible(true);
  };

  const removeProduct = async () => {
    try {
      await deleteDoc(doc(firestore, 'produtos', selectedProduct));
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Erro ao remover produto:', error);
    }
  };

  // Função para reiniciar os estados ao fechar o modal de adição
  const resetAddModal = () => {
    setProductName('');
    setProductBrand('');
    setProductPrice('');
    setProductSize('');
    setModalVisible(false);
  };

  // Função para reiniciar os estados ao fechar o modal de edição
  const resetEditModal = () => {
    setSelectedProduct(null);
    setProductName('');
    setProductBrand('');
    setProductPrice('');
    setProductSize('');
    setEditModalVisible(false);
  };

  // Renderização dos produtos
  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <View>
        <Text style={styles.productInfo}>{`Nome: ${item.nome || 'Nome não definido'}`}</Text>
        <Text style={styles.productInfo}>{`Marca: ${item.marca || 'Marca não definida'}`}</Text>
        <Text style={styles.productInfo}>{`Preço: ${item.preço || 'Preço não definido'}`}</Text>
        <Text style={styles.productInfo}>{`Tamanho: ${item.tamanho || 'Tamanho não definido'}`}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => openEditModal(item)} style={[styles.button, styles.editButton]}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmRemoveProduct(item.id)} style={[styles.button, styles.removeButton]}>
          <Text style={styles.buttonText}>Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleConfirmation = () => {
    if (confirmationAction) {
      confirmationAction();
    }
    setConfirmationModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
        <Text style={styles.addButtonText}>Adicionar Produto</Text>
      </TouchableOpacity>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.productList}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={productName}
              onChangeText={text => setProductName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Marca"
              value={productBrand}
              onChangeText={text => setProductBrand(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Preço"
              value={productPrice}
              onChangeText={text => setProductPrice(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Tamanho"
              value={productSize}
              onChangeText={text => setProductSize(text)}
            />
            <Button title="Adicionar" onPress={confirmAddProduct} />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={productName}
              onChangeText={text => setProductName(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Marca"
              value={productBrand}
              onChangeText={text => setProductBrand(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Preço"
              value={productPrice}
              onChangeText={text => setProductPrice(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Tamanho"
              value={productSize}
              onChangeText={text => setProductSize(text)}
            />
            <Button title="Salvar" onPress={confirmEditProduct} />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={() => setErrorModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <Button title="Fechar" onPress={() => setErrorModalVisible(false)} />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmationModalVisible}
        onRequestClose={() => setConfirmationModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.confirmationText}>Você tem certeza que deseja continuar?</Text>
            <View style={styles.confirmationButtons}>
  <View style={styles.confirmationButton}>
    <Button title="Sim" onPress={handleConfirmation} />
  </View>
  <View style={styles.confirmationButton}>
    <Button title="Não" onPress={() => setConfirmationModalVisible(false)} />
  </View>
</View>



          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  productList: {
    flexGrow: 1,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
  },
  productInfo: {
    flex: 1,
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    padding: 5,
    borderRadius: 5,
    marginLeft: 5,
  },
  editButton: {
    backgroundColor: '#6699cc',
  },
  removeButton: {
    backgroundColor: '#FF6347',
  },
  buttonText: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#6699cc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  confirmationButton: {
    backgroundColor: '#6699cc',

    borderRadius: 5,
  },
  confirmationButtonText: {
    color: '#fff',
    fontSize: 16,
  },

  
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  
});

export default TelaProduto;
