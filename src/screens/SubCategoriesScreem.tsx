import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput, Modal, ActivityIndicator, ScrollView} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SubcategoriesSyles} from "../styles/SubcategoriesSyles";
import { SubcategoryService, authService} from "../services/api";

//me falta arreglar esto
export default function SubcategoriesScreen(){
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [formData, setFormData] = useState({name : "", description: ""});
    const [error, setError] = useState("");
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect (() => {
        loadSubcategories();
        loadCategories();
        loadCurrentUser();
    }, []);

    const loadCurrentUser = async () => {
        try{
            const user = await authService.getCurrentUser();
            setCurrentUser(user);
        }catch(error){
            console.error("error al cargar usuario:", error);
        }
    };

    
    const loadSubcategories = async () => {
        setLoading(true);
        try{
            const response = await SubcategoryService.getAll();
            setSubcategories(response?.data || []);
        }catch(error){
            setError("No se pudieron cargar las subcategorias mi rey");
            setSubcategories([]);
        } finally{
            setLoading(false);
        }
    };
    //Aqui va modificacion  

        const loadSubcategories = async () => {
        setLoading(true);
        try{
            const response = await CategoryService.getAll();
            setcategories(response?.data || []);
        }catch(error){
           console.error('Error al cargar las categorias mi bro');
           setCategories([ ]);
        } 
    };


    const handlesave = async () => {
        if(!form.Data){
            Alert.alert("Error", "el nombre es obligatorio");
            return;
        }
        
        try{//Aqui va otra modificacion 
            const data ={
                name: formData.name,
                description: formData.description,
                active: formData.active,


            }
            if(editing){
                await categoryService.update(editing.id, formData);
                Alert.alert("Exito","categoria actualizada exitosamente");
            }else{
                await categoryService.create(formData);
                Alert.alert("Exito", "Subcategoria creada exitosamente exitosa");
                setModalVisible(false);
                resetForm();
                loadCategories();
            }
        }catch(error){
            Alert.alert("Error","No se pudo guardar la categoria");
        }
    };

    const handleDelete = (item: any) => {
        if(currentUser?.role !== "admin"){
            Alert.alert("Acceso denegado", "Solo los administradores pueden eliminar categorias");
            return;
        }
        Alert.alert("Confiar", '¿eliminar subcategoria ${item.name}?',[
            {text: 'Cancelar', style: 'cancel'},
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    try{
                        await categoryService.delete(item.id);
                        Alert.alert("Exito", "categoria eliminada exitosamente");
                        loadCategories();
                    }catch(error){
                        Alert.alert("Error", "No se pudo eliminar la categoria");
                    }
                }
            }
        ]);
    };

    const handleToggleActive = (item: any) => {
        const action = item.active ? "Desactivar": "Activar";(
        Alert.alert("Confirmar", ¿${action.charAt(0).toUpperCase()+ action.slice(1)} ${item.name}?),
        [
            {text: "Cancelar", style: "cancel"},
            {
                text: action.charAt(0).toUpperCase() +action.slice(1),onPress: async () => {
                    try{
                        await categoryService.update(item.id,{
                            name: item.name,
                            description: item.description,
                            active: !item.active
                        });
                        Alert.alert("Exito", 'Subcategoria ${item.active ? "desactivada": "activada"}');
                        loadSubcategories();
                    }catch(error){
                        Alert.alert("Error", No se pudo ${action});
                    }
                }
            }
        ]);
    };

    //Aqui va una funcion *const openModal*

    const handleEdit = (item: any) => {
    setFormData({name: item.name, description: item.description || ""});
    setEditing(item);
    setModalVisible(true);
    };

    const resetForm = () => {
        setEditing(null);
        setFormData({name: '', description: '', categoryId: '', active: true});
    };

      if(loading){
        return(
            <View style={categoriesSyles.loadingContainer}>
                <ActivityIndicator size="large" color="#007Aff"></ActivityIndicator>
                <Text style={categoriesSyles.loadingText}> Cargando...</Text>
            </View>
        );
    }

    return(
        <View style={SubcategoriesSyles.container}>
            <View style={SubcategoriesSyles.header}>
                <View style={SubcategoriesSyles.headerContext}>
                    <Text style={SubcategoriesSyles.headerTitle}> Gestiones de Categorias</Text>
                    <TouchableOpacity style={SubcategoriesSyles.addButton} onPress={() => {
                        resetForm();
                        setModalVisible(true);
                    }}>
                        <Text style={SubcategoriesSyles.addButtonText}> Nueva Categoria</Text>
                    </TouchableOpacity>
                </View>
            </View>
 

  
            <FlatList data={categories}
                renderItem={renderCategory}
                keyExtractor={(item) => item.id?.toString() || ""}
                contentContainerStyle={categoriesSyles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={!loading && !error ?(
                    <View style={categoriesSyles.emptyContainer}>
                        <Text style={categoriesSyles.emptyText}> No hay categorias</Text>
                        <Text style={categoriesSyles.emptySubText}> Toca "Nueva" para comenzar</Text>
                    </View>
                ): null}>
            </FlatList>

            <Modal animationType="slide" transparent={true} visible={modalVisible}>
                <View style={categoriesSyles.modalOverlay}>
                    <View style={categoriesSyles.modalContext}>
                        <ScrollView>
                            <View style={categoriesSyles.modalHeader}>
                                <Text style={categoriesSyles.modalTitle}>{editing ? "editar categoria": "nueva categoria"}</Text>
                            </View>


                            <View style={categoriesSyles.formContainer}>
                                <View style={categoriesSyles.inputGroup}>
                                    <Text style={categoriesSyles.inputLabel}>Nombre *</Text>
                                    <TextInput style={categoriesSyles.input} value={formData.name}
                                    onChangeText={(text) => setFormData({...formData, name: text})}
                                    placeholder="nombre de la categoria"
                                    placeholderTextColor="#999" >
                                    </TextInput>
                                </View>
                                <View style={categoriesSyles.inputGroup}>
                                    <Text style={categoriesSyles.inputLabel}>Descripción</Text>
                                    <TextInput style={[categoriesSyles.input, categoriesSyles.textArea]}
                                    value={formData.description}
                                    onChangeText={(text) => setFormData({...formData,description: text})}
                                    placeholder="Descripcion opcional"
                                    placeholderTextColor="#999"
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"></TextInput>
                                </View>
                            </View>

                            <View style={categoriesSyles.modalActions}>
                                <TouchableOpacity style={[categoriesSyles.secundaryButton]}
                                onPress={()=> setModalVisible(false)}>
                                    <Text style={[categoriesSyles.modalButtonText, categoriesSyles.cancelButtonText]}>Cancelar</Text>
                                        <TouchableOpacity style={[categoriesSyles.modalButton, categoriesSyles.saveButton]}
                                        onPress={handlesave}>
                                            <Text style={[categoriesSyles.modalButtonText, categoriesSyles.saveButtonText]}>
                                                {editing ? "Actualizar": "Crear"}
                                            </Text>
                                        </TouchableOpacity>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
        
    );
}