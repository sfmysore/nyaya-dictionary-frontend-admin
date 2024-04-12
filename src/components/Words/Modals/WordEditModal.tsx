import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  Input,
  FormLabel,
  Flex,
  Button,
  useToast,
  Spinner,

  } from '@chakra-ui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BaseSyntheticEvent, useState } from 'react'
import { editWord } from '../../../api/WordApi'
import { AxiosError } from 'axios'


interface WordAddModalProps {
  isOpen: boolean
  onClose: () => void
  dataItem: {
    sanskrit_word: string,
    english_transliteration: string
  }
}

export default function WordEditModal({ isOpen, onClose, dataItem } : WordAddModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const toast = useToast()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: editWord,
    onSuccess: (data: {message: string}) => {
      queryClient.invalidateQueries({queryKey: ["words", dataItem.sanskrit_word]})
      setIsLoading(false)
      onClose()
      toast({
        title: data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    },
    onError: (res: AxiosError) => {
      toast({
        title: res.response?.data ? `Error: ${Object.entries(res.response?.data)[0][1]}` : `Error: ${res.message}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setIsLoading(false)
      onClose()
    }
  })
  
  const handleSubmit = (e: BaseSyntheticEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const sanskrit_word = e.target[0].value
    const english_transliteration = e.target[1].value
    mutation.mutate({word: sanskrit_word, english_transliteration})
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      {isLoading ?
        <Spinner/> :
        (<ModalContent>
          <ModalHeader>Edit Word Details</ModalHeader>
          <ModalCloseButton />
          <form onSubmit = {(e) => handleSubmit(e)}>
            <ModalBody>
              <Flex gap = "4" direction = "column">
                <FormControl>
                  <FormLabel>Sanskrit Word</FormLabel>
                  <Input placeholder = "Enter Sanskrit word" required defaultValue={dataItem.sanskrit_word}/>
                </FormControl>
                <FormControl>
                  <FormLabel>English Transliteration</FormLabel>
                  <Input placeholder = "Enter English Transliteration" required defaultValue={dataItem.english_transliteration} />
                </FormControl>
              </Flex>
            </ModalBody>
            <ModalFooter justifyContent="center" gap = "4">
              <Button type = "submit" bg = "tertiary.400" color = "foreground" _hover = {{bg: "tertiary.500"}}>Submit</Button>
              <Button onClick = {onClose} bg = "primary.400" color = "foreground" _hover = {{bg: "primary.500"}}>Close</Button>
            </ModalFooter>
          </form>
      </ModalContent>
      )}
    </Modal>
  )
}
