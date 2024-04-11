import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { getWord } from "../api/WordApi"
import BaseLayout from "../layouts/BaseLayout"

import { 
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  useDisclosure,
  IconButton,
  Flex,
} from "@chakra-ui/react"

import SingleWordMeaning from "../components/Words/SingleWordMeaning"
import AddMeaningModal from "../components/Words/Modals/AddMeaningModal"
import { MdDelete, MdEdit } from "react-icons/md"
import { IoIosCreate } from "react-icons/io"
import WordEditModal from "../components/Words/Modals/WordEditModal"


export default function WordEditPage() {
  let { word } = useParams();

  if(word === undefined){
    word = ""
  }

  const { data: word_data } = useQuery({
    queryKey: ["words", word],
    queryFn: () => getWord(word),
  });
  
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure()
  const {isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose} = useDisclosure()

  return (
    <BaseLayout>
      <Box w="80%" mx="auto" boxShadow="lg" mt="16" bg="foreground" rounded="md" p="4">
        {word_data && (
          <Box w="100%">
            <Box textAlign="center" fontSize="3xl" fontWeight="bold" position = "relative">
              <Heading>{word_data.sanskrit_word} | {word_data.english_transliteration}</Heading>
              <Flex position = "absolute" right = "2" top = "2" gap = "2">
                <IconButton aria-label = "Add Meaning" title = "Add Meaning" icon = {<IoIosCreate />} size = "sm" fontSize = "xl" variant='outline' colorScheme = "blue" onClick = {onAddOpen}/>
                <IconButton aria-label = "Edit" title = "Edit Word" icon = {<MdEdit />} size = "sm" fontSize = "xl" variant='outline' colorScheme = "alphas" onClick = {onAddOpen}/>
                <IconButton aria-label = "Delete" title = "Delete word" icon = {<MdDelete />} size = "sm" fontSize = "xl" variant='outline' colorScheme = "red" onClick = {onAddOpen}/>
              </Flex>
            </Box>
            <Box mt="6">
              <Tabs isFitted variant="enclosed-colored" isLazy>
                <TabList mb="1em">
                  {word_data.meaning_ids?.map((meaning_id: number, index: number) => (
                    <Tab key={meaning_id}>Meaning {index + 1}</Tab>
                  ))}
                </TabList>
                <TabPanels>
                  {word_data.meaning_ids?.map((meaning_id: number) => (
                    <TabPanel key={meaning_id}>
                      <SingleWordMeaning word={word_data.sanskrit_word} meaning_id={meaning_id} />
                    </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
            </Box>
          </Box>
        )}
      </Box>
      <AddMeaningModal word = {word} isOpen={isAddOpen} onClose={onAddClose}/>
      <WordEditModal word = {word} isOpen={isEditOpen} onClose={onEditClose}/>  
    </BaseLayout>
  );
}
