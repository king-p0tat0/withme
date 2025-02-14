package com.javalab.student.service.shop;


import com.javalab.student.constant.ItemSellStatus;
import com.javalab.student.dto.shop.ItemFormDto;
import com.javalab.student.dto.shop.ItemImgDto;
import com.javalab.student.dto.shop.ItemSearchDto;
import com.javalab.student.dto.shop.MainItemDto;
import com.javalab.student.entity.shop.CartItem;
import com.javalab.student.entity.shop.Item;
import com.javalab.student.entity.shop.ItemImg;
import com.javalab.student.repository.shop.ItemImgRepository;
import com.javalab.student.repository.shop.ItemRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ItemService {

    // 의존성 주입
    private final ItemRepository itemRepository;
    private final ItemImgService itemImgService;
    private final ItemImgRepository itemImgRepository;

    // 상품 등록
    public Long saveItem(ItemFormDto itemFormDTO, List<MultipartFile> itemImgFileList) throws Exception{

        // 1. 상품 등록, 저장(영속화)
        // 1.1. ItemFormDto의 crateItem() 메소드를 통해 Item 객체 생성(Dto -> Entity)
        Item item = itemFormDTO.crateItem();
        // 1.2. ItemRepository의 save() 메소드를 통해 Item 객체 저장
        // save(item) : JPA의 ENtityManager가 persist(item) 메소드 호출해서 해당 엔티티를 영속화
        // item 엔티티가 데이터베이스에 저장되고 기본키를 발급받아서 그 기본키로 영속성 컨텍스트에 저장됨
        itemRepository.save(item);

        // 2. 이미지 등록
        for(int i=0;i<itemImgFileList.size(); i++){
            // 2.1. ItemImg 객체 생성
            ItemImg itemImg = new ItemImg();
            // 2.2. Item 객체와 연관관계 설정
            itemImg.setItem(item);
            // 2.3. 대표 이미지 여부 설정
            if( i == 0)
                itemImg.setRepimgYn("Y");
            else
                itemImg.setRepimgYn("N");
            // 2.4. ItemImgService의 saveItemImg() 메소드를 통해 ItemImg 객체 저장
            itemImgService.saveItemImg(itemImg, itemImgFileList.get(i));
        }
        return item.getId();
    }

    /**
     * 상품 상세 조회
     * - 한 개의 상품과 여러 개의 상품 이미지 정보를 조회하는 메서드
     * - 상품 ID를 전달받아 상품 상세 정보를 조회하는 메서드 상품 이미지 정보를 조회한다.
     * - 상품 정보와 상품 이미지 정보를 조합하여 상품 상세 정보를 반환한다.
     * - 트랜잭션 내에서 INSERT, UPDATE, DELETE 쿼리가 발생하지 않도록 보장.
     *   혹시 다른 레이어에서 여기서 영속화한 엔티티를 수정하거나 삭제하는 경우가 있을 수 있기 때문에
     *   readOnly = true 옵션을 사용하여 트랜잭션 내에서 SELECT 쿼리만 실행하도록 설정한다.
     * - readOnly = true 옵션을 사용하여 트랜잭션 내에서 SELECT 쿼리만 실행하도록 설정한다.
     * @param itemId
     */
    @Transactional(readOnly = true)
    public ItemFormDto getItemDetail(Long itemId) {

        // 1. 상품 번호로 해당 상품의 이미지들을 조회한다.
        List<ItemImg> itemImgList = itemImgRepository.findByItemIdOrderByIdAsc(itemId);

        // 2. 조회한 이미지들을 ItemImgDto로 변환하기 위해 List에 담는다.
        List<ItemImgDto> itemImgDtoList = new ArrayList<>();
        for(ItemImg itemImg : itemImgList){
            ItemImgDto itemImgDto = ItemImgDto.entityToDto(itemImg);
            itemImgDtoList.add(itemImgDto);
        }

        // 3. 상품 번호로 해당 상품을 조회한다. 이렇게 조회하면 영속성 컨텍스트에 해당 엔티티가 영속화된다.
        Item item = itemRepository.findById(itemId)
                .orElseThrow(EntityNotFoundException::new);

        // 조회한 3.상품 정보와 2.이미지 정보를 조합하여 ItemFormDto로 변환한다.
        // 변환하는 이유는 화면에 출력하기 위함이다.
        ItemFormDto itemFormDto = ItemFormDto.of(item);

        // 4. ItemFormDto에 이미지 정보를 설정한다.
        itemFormDto.setItemImgDtoList(itemImgDtoList);
        // 상품정보와 상품의 이미지 정보들에 대한 조회 완료

        return itemFormDto;
    }

    /**
     * 상품 수정
     * @param itemFormDto
     * @param itemImgFileList
     */
    public long updateItem(ItemFormDto itemFormDto,
                           List<MultipartFile> itemImgFileList) throws Exception {
        // 1. 수정할 상품 조회, 영속화 - 상품 정보를 수정하기 위해 조회
        Item item = itemRepository.findById(itemFormDto.getId()).orElseThrow(EntityNotFoundException::new);

        // 2. 영속화 되어 있는 상품의 정보를 수정한다. - 변경 감지(dirty checking) - 자동감지후 자동 저장됨.
        item.updateItem(itemFormDto);

        // 3. 화면에서 전달된 상품 이미지의 키(기본키)를  arrayList로 받아온다.
        List<Long> itemImgIds = itemFormDto.getItemImgIds();

        // 4. 화면에서 전달된 상품 이미지 파일을 업데이트한다.
        for(int i = 0; i < itemImgFileList.size(); i++){
            // 4.1. 상품 이미지 파일을 업데이트한다.(상품 이미지 id, 상품 이미지 파일)
            itemImgService.updateItemImg(itemImgIds.get(i), itemImgFileList.get(i));
        }
        return item.getId();
    }


    /**
     * 아이템 전체 리스트
     */
    public List<Item> getItemList() {
        return itemRepository.findAll();
    }

    /**
     * 판매 상태로 검색
     */
    /*public List<Item> getItemListByItemSellStatus(ItemSellStatus itemSellStatus) {
        return itemRepository.findByItemSellStatus(itemSellStatus);
    }*/

    /**
     * 판매중인 상품 리스트
     * 대표 이미지만 반환
     * @param itemSellStatus
     * @return
     */
    @Transactional(readOnly = true)
    public List<ItemFormDto> getItemListByItemSellStatus(ItemSellStatus itemSellStatus) {
        // 1. 판매 상태에 따라 상품 목록 조회
        List<Item> itemList = itemRepository.findByItemSellStatus(itemSellStatus);

        // 2. 조회된 상품 목록을 ItemFormDto 리스트로 변환
        List<ItemFormDto> itemFormDtoList = new ArrayList<>();

        for (Item item : itemList) {
            // 3. 해당 상품의 대표 이미지 조회 (repimgYn = 'Y'인 이미지만 가져오기)
            ItemImg repItemImg = itemImgRepository.findByItemIdAndRepimgYn(item.getId(), "Y");

            // 4. 대표 이미지가 있을 경우, ItemImgDto로 변환
            ItemImgDto repItemImgDto = null;
            if (repItemImg != null) {
                repItemImgDto = ItemImgDto.entityToDto(repItemImg); // 대표 이미지 DTO 변환
            }

            // 5. 상품 정보를 ItemFormDto로 변환하고, 대표 이미지 정보 추가
            ItemFormDto itemFormDto = ItemFormDto.of(item);
            if (repItemImgDto != null) {
                itemFormDto.setItemImgDtoList(List.of(repItemImgDto)); // 대표 이미지만 리스트에 추가
            } else {
                itemFormDto.setItemImgDtoList(new ArrayList<>()); // 대표 이미지가 없는 경우 빈 리스트
            }

            // 6. 변환된 DTO를 리스트에 추가
            itemFormDtoList.add(itemFormDto);
        }

        return itemFormDtoList;
    }


    /**
     * 아이템 삭제
     */
    public void delete(Long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(EntityNotFoundException::new);
        itemRepository.delete(item);
    }
}
